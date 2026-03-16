"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Check, X, FileText, Filter, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Pagination } from "@/components/pagination"
import Link from "next/link"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { loadFontBase64 } from "@/utils/fontToBase64"
// import RobotoTTF from "roboto-regular/fonts/Roboto-Regular.ttf"

// ---------- Helper: remove Vietnamese tones ----------
const removeVietnameseTones = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
}

export function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [selectedOrders, setSelectedOrders] = useState<number[]>([])
  const [editingStatusId, setEditingStatusId] = useState<number | null>(null)
  const [tempStatus, setTempStatus] = useState<string>("")
  const token = localStorage.getItem("token")

  // ---------- Fetch orders ----------
  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await axios.get("http://localhost:8080/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const ordersData = res.data?.result || []

      // Sắp xếp
      ordersData.sort((a: any, b: any) => {
        // 1️⃣ theo trạng thái
        if (a.status !== b.status) {
          return a.status - b.status
        }

        // 2️⃣ cùng trạng thái → theo ngày
        return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
      })

      setOrders(ordersData)
    } catch (err) {
      console.error("Error loading orders:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  // ---------- Helpers ----------
  const statusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Chờ xử lý"
      case "PROCESSING":
        return "Đã xác nhận"
      case "SHIPPING":
        return "Đang giao hàng"
      case "COMPLETED":
        return "Hoàn thành"
      case "CANCELED":
        return "Đã huỷ"
      default:
        return "Không xác định"
    }
  }

  const statusNumberMap: Record<string, string> = {
    PENDING: "1",
    PROCESSING: "2",
    SHIPPING: "3",
    COMPLETED: "4",
    CANCELED: "5",
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "bg-amber-50 text-amber-700 border-amber-200"

      case "PROCESSING":
        return "bg-blue-50 text-blue-700 border-blue-200"

      case "SHIPPING":
        return "bg-indigo-50 text-indigo-700 border-indigo-200"

      case "COMPLETED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"

      case "CANCELED":
        return "bg-red-50 text-red-700 border-red-200"

      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const isStatusDisabled = (currentStatus: string, targetStatus: string) => {

    if (currentStatus === "PENDING") {
      return ["SHIPPING", "COMPLETED"].includes(targetStatus)
    }

    if (currentStatus === "PROCESSING") {
      return ["COMPLETED", "CANCELED"].includes(targetStatus)
    }

    if (currentStatus === "SHIPPING") {
      return ["PENDING", "PROCESSING", "CANCELED"].includes(targetStatus)
    }

    if (currentStatus === "COMPLETED") {
      return targetStatus !== "COMPLETED"
    }

    if (currentStatus === "CANCELED") {
      return targetStatus !== "CANCELED"
    }

    return false
  }

  const formatCurrency = (value: number | null | undefined) => {
    return new Intl.NumberFormat("vi-VN").format(value ?? 0)
  }

  const formatDate = (iso?: string) => {
    if (!iso) return "-"
    try {
      const date = new Date(iso)
      const day = String(date.getDate()).padStart(2, "0")
      const month = String(date.getMonth() + 1).padStart(2, "0")
      const year = date.getFullYear()
      const hours = String(date.getHours()).padStart(2, "0")
      const minutes = String(date.getMinutes()).padStart(2, "0")
      const seconds = String(date.getSeconds()).padStart(2, "0")
      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
    } catch {
      return iso
    }
  }

  // ---------- Filtering & Pagination ----------
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id?.toString().includes(searchQuery) ||
      order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.orderCode?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / rowsPerPage))
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + rowsPerPage)

  // ---------- Selection handlers ----------
  const handleOrderSelect = (orderId: number) => {
    setSelectedOrders((prev) => (prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]))
  }

  const handleSelectAll = () => {
    const pageIds = paginatedOrders.map((o) => o.id)
    const allSelected = pageIds.every((id) => selectedOrders.includes(id))
    if (allSelected) {
      setSelectedOrders((prev) => prev.filter((id) => !pageIds.includes(id)))
    } else {
      setSelectedOrders((prev) => Array.from(new Set([...prev, ...pageIds])))
    }
  }

  // ---------- Export PDF ----------
  const handleExportPDF = () => {
    if (selectedOrders.length === 0) {
      alert("Vui lòng chọn ít nhất một đơn hàng để xuất PDF")
      return
    }

    const pdf = new jsPDF()

    selectedOrders.forEach((orderId, index) => {
      const order = orders.find((o) => o.id === orderId)
      if (!order) return
      if (index > 0) pdf.addPage()

      pdf.setFont("helvetica")
      pdf.setFontSize(16)
      pdf.text(removeVietnameseTones(`ĐƠN HÀNG ${order.orderCode}`), 14, 15)
      pdf.setFontSize(12)

      const info = [
        [removeVietnameseTones("Ma don"), removeVietnameseTones(order.orderCode)],
        [removeVietnameseTones("Khach hang"), removeVietnameseTones(order.customerName || "-")],
        [removeVietnameseTones("SDT"), order.customerPhone || "-"],
        [removeVietnameseTones("Dia chi"), removeVietnameseTones(order.customerAddress || "-")],
        [removeVietnameseTones("Ngay dat"), formatDate(order.createdDate)],
        [removeVietnameseTones("VAT"), `${formatCurrency(order.vat)} VND`],
        [removeVietnameseTones("Tong tien"), `${formatCurrency(order.totalPrice)} VND`],
        [removeVietnameseTones("Trang thai"), removeVietnameseTones(statusText(order.status))],
      ]

      autoTable(pdf, {
        startY: 25,
        head: [["Thong tin", "Gia tri"]],
        body: info,
        theme: "grid",
        styles: { fontSize: 11 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255 },
      })

      const details = order.orderDetails.map((d: any) => [
        removeVietnameseTones(d.productDetail.product.name),
        removeVietnameseTones(d.productDetail.configuration?.name ?? "-"),
        d.quantity,
        `${formatCurrency(d.unitPrice)} VND`,
      ])

      autoTable(pdf, {
        startY: 25 + info.length * 10 + 10,
        head: [["San pham", "Cau hinh", "SL", "Don gia"]],
        body: details,
        theme: "grid",
        styles: { fontSize: 11 },
        headStyles: { fillColor: [39, 174, 96], textColor: 255 },
      })
    })

    pdf.save("orders.pdf")
    alert("Xuất PDF thành công!")
    setSelectedOrders([])
  }


  // ---------- Status editing ----------
  const handleStatusClick = (orderId: number, currentStatus: string) => {
    setEditingStatusId(orderId)
    setTempStatus(statusNumberMap[currentStatus]) // convert enum -> number string
  }

  const handleStatusCancel = () => {
    setEditingStatusId(null)
    setTempStatus("")
  }

  const handleStatusUpdate = async (orderId: number) => {
    const statusNumber = Number(tempStatus)
    const token = localStorage.getItem("token")

    try {
      await fetch(`http://localhost:8080/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          status: statusNumber
        }),
      })
    } catch (error) {
      console.error("Cập nhật trạng thái thất bại", error)
    }
  }

  // ---------- JSX ----------
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Input
            placeholder="Tìm kiếm đơn hàng (ID hoặc tên khách)..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
            className="pl-3 border-gray-200"
          />
        </div>

        <div className="flex gap-2 items-center">
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1) }}>
            <SelectTrigger className="w-48 border-gray-200 flex items-center gap-1">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                Tất cả trạng thái
              </SelectItem>

              <SelectItem value="PENDING">
                Chờ xử lý
              </SelectItem>

              <SelectItem value="PROCESSING">
                Đã xác nhận
              </SelectItem>

              <SelectItem value="SHIPPING">
                Đang giao hàng
              </SelectItem>

              <SelectItem value="COMPLETED">
                Hoàn thành
              </SelectItem>

              <SelectItem value="CANCELED">
                Đã huỷ
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={handleExportPDF}
            variant="outline"
            className="border-red-500 text-red-600 hover:bg-red-50 bg-transparent"
            disabled={selectedOrders.length === 0}
          >
            <FileText className="h-4 w-4 mr-2" />
            Export PDF ({selectedOrders.length})
          </Button>
        </div>
      </div>

      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200 bg-white">
                <TableHead className="w-12">
                  <Checkbox
                    checked={paginatedOrders.length > 0 && paginatedOrders.every((o) => selectedOrders.includes(o.id))}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>ID</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Ngày đặt</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    {loading ? "Đang tải..." : "Không có đơn hàng"}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedOrders.map((order) => (
                  <TableRow key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <TableCell>
                      <Checkbox
                        checked={selectedOrders.includes(order.id)}
                        onCheckedChange={() => handleOrderSelect(order.id)}
                      />
                    </TableCell>

                    <TableCell className="py-4 font-medium">{order.orderCode}</TableCell>
                    <TableCell className="py-4 font-medium">{order.customerName || "-"}</TableCell>
                    <TableCell className="py-4 text-gray-700">{formatDate(order.createdDate)}</TableCell>
                    <TableCell className="py-4 font-semibold text-orange-600">₫{formatCurrency(order.totalPrice)}</TableCell>

                    <TableCell className="py-4">
                      {editingStatusId === order.id ? (
                        <div className="flex items-center gap-2">
                          <Select value={tempStatus} onValueChange={setTempStatus}>
                            <SelectTrigger className="w-40 h-8">
                              <SelectValue placeholder="Chọn trạng thái" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem
                                value="1"
                                disabled={isStatusDisabled(order.status, "PENDING")}
                              >
                                Chờ xử lý
                              </SelectItem>

                              <SelectItem
                                value="2"
                                disabled={isStatusDisabled(order.status, "PROCESSING")}
                              >
                                Đã xác nhận
                              </SelectItem>

                              <SelectItem
                                value="3"
                                disabled={isStatusDisabled(order.status, "SHIPPING")}
                              >
                                Đang giao hàng
                              </SelectItem>

                              <SelectItem
                                value="4"
                                disabled={isStatusDisabled(order.status, "COMPLETED")}
                              >
                                Hoàn thành
                              </SelectItem>

                              <SelectItem
                                value="5"
                                disabled={isStatusDisabled(order.status, "CANCELED")}
                              >
                                Đã huỷ
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          <Button size="sm" variant="ghost" onClick={() => handleStatusUpdate(order.id)} className="h-8 w-8 p-0 text-green-600 hover:bg-green-50">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={handleStatusCancel} className="h-8 w-8 p-0 text-red-600 hover:bg-red-50">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStatusClick(order.id, order.status)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)} cursor-pointer hover:opacity-80 transition-opacity`}
                        >
                          {statusText(order.status)}
                        </button>
                      )}
                    </TableCell>

                    <TableCell className="py-4 text-right">
                      <Link href={`/orders/${order.id}`}>
                        <Button variant="ghost" size="sm" className="hover:bg-blue-50">
                          <Eye className="h-4 w-4 text-blue-500" />
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        rowsPerPage={rowsPerPage}
        totalItems={filteredOrders.length}
        onPageChange={(p: number) => setCurrentPage(p)}
        onRowsPerPageChange={(r: number) => { setRowsPerPage(r); setCurrentPage(1) }}
      />
    </div>
  )
}
