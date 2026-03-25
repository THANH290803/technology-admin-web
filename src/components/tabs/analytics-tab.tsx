"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Bot,
  BarChart3,
  Loader2,
  AlertTriangle,
  TrendingUp,
  PackageCheck,
  LineChart as LineChartIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// 🛑 FIX: Hàm parse markdown chuẩn xịn, không "ăn cắp" mất data bảng của Gemini
const parseMarkdown = (text: string) => {
  if (!text) return { __html: "" };
  let html = text
    .replace(
      /### (.*?)\n/g,
      '<h3 class="text-xl font-bold text-indigo-800 mt-6 mb-2 uppercase">$1</h3>',
    )
    .replace(
      /## (.*?)\n/g,
      '<h2 class="text-2xl font-bold text-indigo-900 mt-6 mb-3 border-b pb-2">$1</h2>',
    )
    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-900">$1</strong>')
    .replace(/\* (.*?)\n/g, '<li class="ml-6 list-disc mb-1.5">$1</li>')
    .replace(/- (.*?)\n/g, '<li class="ml-6 list-disc mb-1.5">$1</li>')
    .replace(/\n\n/g, "</p><p class='mb-3'>") // Xuống 2 dòng tạo Paragraph
    .replace(/\n/g, "<br />"); // Xuống 1 dòng tạo Break
  return { __html: `<p class='mb-3'>${html}</p>` };
};

export function AnalyticsTab() {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  // State cho biểu đồ Popup
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);

  useEffect(() => {
    fetchAnalytics(true);
  }, []);

  const fetchAnalytics = async (isAutoLoad = false) => {
    const currentToken = localStorage.getItem("token");
    if (!currentToken) {
      if (!isAutoLoad) toast.error("Vui lòng đăng nhập lại!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8080/api/analytics/smart-inventory",
        {
          headers: { Authorization: `Bearer ${currentToken}` },
        },
      );
      // Data từ BE bọc trong result
      setAnalyticsData(response.data.result);
      if (!isAutoLoad)
        toast.success("Đã phân tích lại báo cáo AI thành công! 🎉");
    } catch (error) {
      console.error("Lỗi khi gọi AI Analytics:", error);
      if (!isAutoLoad) toast.error("Hệ thống AI đang bận hoặc có lỗi xảy ra!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewChart = async (productName: string) => {
    const currentToken = localStorage.getItem("token");
    setSelectedProduct(productName);
    setIsChartModalOpen(true);
    setIsChartLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8080/api/analytics/history?productName=${encodeURIComponent(productName)}`,
        { headers: { Authorization: `Bearer ${currentToken}` } },
      );

      const formattedData = res.data.result.map((item: any) => ({
        name: `Tháng ${item.forecastMonth}`,
        "AI Dự báo": item.predictedDemand || 0,
        "Thực tế bán": item.actualSold || 0,
        "Sai số (%)":
          item.accuracyVariance !== null ? item.accuracyVariance : 0,
      }));
      setHistoryData(formattedData);
    } catch (error) {
      toast.error("Không tải được dữ liệu lịch sử!");
      setIsChartModalOpen(false);
    } finally {
      setIsChartLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER BẢNG ĐIỀU KHIỂN */}
      <div className="flex items-center justify-between bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bot className="h-8 w-8 text-blue-600" />
            AI Smart Inventory (WMA + Gemini)
          </h2>
          <p className="text-gray-500 mt-1">
            Báo cáo tồn kho mới nhất. Bấm Cập nhật để AI phân tích lại dữ liệu
            real-time.
          </p>
        </div>
        <Button
          onClick={() => fetchAnalytics(false)}
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-6 w-6 animate-spin" /> AI đang tính
              toán...
            </>
          ) : (
            <>
              <BarChart3 className="mr-2 h-6 w-6" /> Cập nhật Phân tích AI
            </>
          )}
        </Button>
      </div>

      {isLoading && !analyticsData && (
        <div className="flex justify-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-500" />
        </div>
      )}

      {analyticsData && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-in fade-in duration-500">
          {/* BẢNG SỐ LIỆU ĐỊNH LƯỢNG WMA */}
          <Card className="xl:col-span-2 shadow-md border-0">
            <CardHeader className="bg-gray-50 border-b border-gray-100 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg text-gray-800">
                <BarChart3 className="h-5 w-5 text-indigo-500" />
                Số liệu dự báo định lượng (Thuật toán{" "}
                {analyticsData.algorithm?.split("+")[0] || "WMA"})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="font-semibold text-gray-900">
                      Tên sản phẩm
                    </TableHead>
                    <TableHead className="text-center">2 Tháng trước</TableHead>
                    <TableHead className="text-center">Tháng trước</TableHead>
                    <TableHead className="text-center font-bold text-blue-600">
                      Tháng này
                    </TableHead>
                    <TableHead className="text-center font-bold text-orange-600">
                      Tồn kho
                    </TableHead>
                    <TableHead className="text-center font-bold text-green-600">
                      AI Dự báo
                    </TableHead>
                    <TableHead className="text-right">Trạng thái</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {analyticsData.ml_data.map((item: any) => {
                    const diff = item.currentStock - item.predictedDemand;
                    let statusBadge;

                    if (diff < 0) {
                      statusBadge = (
                        <Badge className="bg-red-100 text-red-700">
                          <AlertTriangle className="w-3 h-3 mr-1" /> Thiếu hàng
                          ({Math.abs(diff)})
                        </Badge>
                      );
                    } else if (diff > 10) {
                      statusBadge = (
                        <Badge className="bg-orange-100 text-orange-700">
                          <TrendingUp className="w-3 h-3 mr-1 rotate-180" />{" "}
                          Thừa hàng (+{diff})
                        </Badge>
                      );
                    } else {
                      statusBadge = (
                        <Badge className="bg-green-100 text-green-700">
                          <PackageCheck className="w-3 h-3 mr-1" /> Ổn định
                        </Badge>
                      );
                    }

                    return (
                      <TableRow
                        key={item.productName}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <TableCell className="font-medium text-gray-900">
                          {item.productName}
                        </TableCell>
                        <TableCell className="text-center text-gray-500">
                          {item.salesMonthNMinus2}
                        </TableCell>
                        <TableCell className="text-center text-gray-500">
                          {item.salesMonthNMinus1}
                        </TableCell>
                        <TableCell className="text-center font-bold text-blue-600 bg-blue-50/30">
                          {item.salesMonthN}
                        </TableCell>
                        <TableCell className="text-center font-bold text-orange-600 bg-orange-50/30">
                          {item.currentStock}
                        </TableCell>
                        <TableCell className="text-center font-bold text-green-600 bg-green-50/30">
                          {item.predictedDemand}
                        </TableCell>
                        <TableCell className="text-right">
                          {statusBadge}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewChart(item.productName)}
                            className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                          >
                            <LineChartIcon className="w-4 h-4 mr-1" /> K.Tra
                            Model
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* BÁO CÁO ĐỊNH TÍNH GEMINI */}
          <Card className="xl:col-span-1 shadow-md border-0 bg-gradient-to-br from-[#f8f9ff] to-[#f0f4ff]">
            <CardHeader className="border-b border-indigo-100/50 pb-4">
              <CardTitle className="flex items-center gap-2 text-lg text-indigo-900">
                <Bot className="h-6 w-6 text-indigo-600" /> Giám đốc Kinh doanh
                AI
              </CardTitle>
              <CardDescription className="text-indigo-600/70">
                Báo cáo phân tích tự động từ Google Gemini
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div
                className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={parseMarkdown(
                  analyticsData.ai_insight,
                )}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* 🛑 POPUP MODAL CHỨA BIỂU ĐỒ 🛑 */}
      <Dialog open={isChartModalOpen} onOpenChange={setIsChartModalOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center gap-2">
              <LineChartIcon className="w-6 h-6 text-indigo-600" />
              AI Model Tracking:{" "}
              <span className="text-orange-600">{selectedProduct}</span>
            </DialogTitle>
            <DialogDescription>
              Đánh giá vòng lặp phản hồi (Inspect & Adapt) - So sánh AI Dự báo
              và Thực tế bán hàng
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {isChartLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
                <p className="text-gray-500">Đang móc nối dữ liệu quá khứ...</p>
              </div>
            ) : (
              <>
                <div className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={historyData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "8px",
                          border: "none",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="AI Dự báo"
                        stroke="#10b981"
                        strokeWidth={3}
                        strokeDasharray="5 5"
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="Thực tế bán"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {historyData.length > 0 && (
                  <div className="mt-6 p-4 bg-yellow-50 rounded-lg flex gap-3 items-start border border-yellow-200 shadow-sm">
                    <AlertTriangle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-bold text-yellow-900 mb-1">
                        AI Adaptability Note:
                      </h4>
                      <p className="text-sm text-yellow-800">
                        Sai số (Variance) của tháng gần nhất là{" "}
                        <strong>
                          {historyData[historyData.length - 1]["Sai số (%)"]}%
                        </strong>
                        .
                        {historyData[historyData.length - 1]["Sai số (%)"] > 15
                          ? " Sai số vượt mức 15%, hệ thống sẽ tự động kích hoạt tiến trình Tuning Weight (Điều chỉnh trọng số WMA) vào cuối chu kỳ Sprint để học lại dữ liệu."
                          : " Mô hình đang dự báo tốt, bám sát thực tế. Trọng số hiện tại [0.2, 0.3, 0.5] sẽ được giữ nguyên cho chu kỳ sau."}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
