"use client"

import { useState, useRef } from "react"
import { useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  ImageIcon,
  LogOut,
  Package,
  Plus,
  Search,
  Settings,
  ShoppingCart,
  Trash2,
  Users,
  LayoutDashboard,
  UserCog,
  DollarSign,
  ShoppingBag,
  Download,
  Wrench,
  X,
  Star,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ProductsTab } from "@/components/tabs/products-tab"
import { OrdersTab } from "@/components/tabs/orders-tab"
import { CustomersTab } from "@/components/tabs/customers-tab"
// import { ConfigurationsTab } from "@/components/tabs/configurations-tab"
import { mockData } from "@/lib/mock-data"
import { toast } from "sonner"

const token = typeof window !== "undefined" ? localStorage.getItem("token") : null


function Pagination({ currentPage, totalPages, onPageChange, rowsPerPage, onRowsPerPageChange, totalItems }: any) {
  return (
    <div className="flex items-center justify-between px-2 py-4 border-t bg-white rounded-b-lg">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Hiển thị</span>
        <Select value={rowsPerPage.toString()} onValueChange={(value) => onRowsPerPageChange(Number(value))}>
          <SelectTrigger className="w-20 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-600">dòng</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          Trang {currentPage} / {totalPages} ({totalItems} kết quả)
        </span>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function OverviewTab() {
  const totalRevenue = mockData.orders.reduce((sum, order) => sum + (order.total || 0), 0)
  const totalOrders = mockData.orders.length
  const totalCustomers = mockData.customers.length
  const totalProducts = mockData.products.length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
              <span>Tổng doanh thu</span>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">₫{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Từ tất cả đơn hàng</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
              <span>Đơn hàng</span>
              <ShoppingCart className="h-4 w-4 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalOrders}</div>
            <p className="text-xs text-gray-500 mt-1">Tổng số đơn hàng</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
              <span>Khách hàng</span>
              <Users className="h-4 w-4 text-purple-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalCustomers}</div>
            <p className="text-xs text-gray-500 mt-1">Khách hàng đã đăng ký</p>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 flex items-center justify-between">
              <span>Sản phẩm</span>
              <Package className="h-4 w-4 text-orange-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalProducts}</div>
            <p className="text-xs text-gray-500 mt-1">Tổng sản phẩm</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Đơn hàng gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Đơn hàng #{order.id}</p>
                    <p className="text-sm text-gray-600">{order.customer_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">₫{order.total?.toLocaleString() || "0"}</p>
                    <Badge className="mt-1 bg-blue-100 text-blue-800">{order.status_text}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Sản phẩm bán chạy</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.products.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <Image
                    src={product.img || "/placeholder.svg"}
                    alt={product.name}
                    width={100}
                    height={100}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{product.amount}</p>
                    <p className="text-xs text-gray-600">Còn lại</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Removed ProductsTab function as it was redeclared
// Removed CustomersTab function as it was redeclared

function ImagesTab({
  selectedItem,
  setSelectedItem,
  isViewModalOpen,
  setIsViewModalOpen,
  isEditModalOpen,
  setIsEditModalOpen,
}: any) {
  const [images, setImages] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState("")

  // Lấy dữ liệu từ API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const token = localStorage.getItem("token")

        const res = await axios.get("http://localhost:8080/api/images", {
          headers: { Authorization: `Bearer ${token}` },
        })

        setImages(res.data?.result || [])   // ⭐ SỬA Ở ĐÂY
        console.log(res.data)

      } catch (error) {
        console.error("❌ Lỗi khi tải danh sách ảnh:", error)
      }
    }

    fetchImages()
  }, [])

  const filteredImages = Array.isArray(images)
    ? images.filter((img) =>
      img.id.toString().includes(searchQuery) ||
      (img.isMain && "main".includes(searchQuery.toLowerCase()))
    )
    : []


  const totalPages = Math.ceil(filteredImages.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedImages = filteredImages.slice(startIndex, startIndex + rowsPerPage)

  const handleEdit = (image: any) => {
    setSelectedItem(image)
    setIsEditModalOpen(true)
  }

  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:8080/api/images/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setImages((prev) => prev.filter((img) => img.id !== deleteId));

      setIsConfirmOpen(false); // đóng popup
      setDeleteId(null);
    } catch (error) {
      console.error("❌ Lỗi xoá ảnh:", error);
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý hình ảnh</h2>
      </div>

      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-orange-500" />
              Danh sách hình ảnh sản phẩm
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo sản phẩm..."
                className="pl-8 w-64 border-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hình ảnh</TableHead>
                <TableHead>Sản phẩm</TableHead>
                {/* <TableHead>Thứ tự</TableHead> */}
                <TableHead>Ảnh chính</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedImages.map((img) => (
                <TableRow key={img.id}>
                  <TableCell>
                    <Image
                      src={img.imageUrl || "/placeholder.svg"}
                      width={100}
                      height={100}
                      alt="Product"
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">{img.productName || "N/A"}</TableCell>
                  <TableCell>
                    {img.isMain ? (
                      <Badge className="bg-orange-100 text-orange-800">
                        <Star className="h-3 w-3 mr-1 fill-orange-500" />
                        Ảnh chính
                      </Badge>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {/* <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(img)}
                        className="hover:bg-orange-50 text-orange-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Button> */}
                      <Button variant="ghost" size="sm" className="hover:bg-red-50 text-red-600"
                        onClick={() => {
                          setDeleteId(img.id);
                          setIsConfirmOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={setRowsPerPage}
            totalItems={filteredImages.length}
          />
        </CardContent>
      </Card>

      {/* Edit Image Modal */}
      {/* <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-orange-500" />
              Chỉnh sửa hình ảnh
            </DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4 py-4">
              <div>
                <Image
                  src={selectedItem.image_url || "/placeholder.svg"}
                  alt="Product"
                  width={100}
                  height={100}
                  className="w-full h-48 rounded-lg object-cover"
                />
              </div>
              <div>
                <Label htmlFor="product">Sản phẩm</Label>
                <Select defaultValue={selectedItem.product_id?.toString()}>
                  <SelectTrigger className="border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mockData.products.map((product) => (
                      <SelectItem key={product.id} value={product.id.toString()}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="order">Thứ tự hiển thị</Label>
                <Input id="order" type="number" defaultValue={selectedItem.order} className="border-gray-200" />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_main"
                  defaultChecked={selectedItem.is_main}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="is_main" className="cursor-pointer">
                  Đặt làm ảnh chính
                </Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-red-600">Xác nhận xoá hình ảnh</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xoá hình ảnh này? Thao tác này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)}>
              Hủy
            </Button>

            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmDelete}
            >
              Xoá
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function AdminsTab({
  selectedItem,
  setSelectedItem,
  isViewModalOpen,
  setIsViewModalOpen,
  isEditModalOpen,
  setIsEditModalOpen,
  isAddModalOpen,
  setIsAddModalOpen,
}: any) {
  const [roles, setRoles] = useState<any[]>([])
  // const [selectedRole, setSelectedRole] = useState<string>(selectedItem?.role || "")

  // 🔹 Lấy danh sách vai trò khi mở modal
  useEffect(() => {
    if (isAddModalOpen || isEditModalOpen) {
      fetchRoles()
    }
  }, [isAddModalOpen, isEditModalOpen])

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem("token") // 👈 token lưu khi login
      const response = await axios.get("http://localhost:8080/api/roles", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      })
      const roleList = (response.data.data || response.data) as any[]
      const filteredRoles = roleList.filter((role) => role.id !== 2)
      setRoles(filteredRoles)
    } catch (error) {
      console.error("Lỗi khi tải danh sách vai trò:", error)
    }
  }

  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState("")
  const [admins, setAdmins] = useState<any[]>([])

  // 🔹 Fetch users (admin + nhân viên)
  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await axios.get("http://localhost:8080/api/accounts", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      const users = (response.data?.result || []) as any[]
      const filtered = users.filter(
        (user: any) => user.role?.id === 1 || user.role?.id === 3
      )
      setAdmins(filtered)
    } catch (error) {
      console.error("Lỗi khi tải danh sách người dùng:", error)
    }
  }


  const filteredAdmins = admins.filter(
    (admin) =>
      admin.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.mail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      admin.role?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filteredAdmins.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedAdmins = filteredAdmins.slice(startIndex, startIndex + rowsPerPage)

  const handleView = (admin: any) => {
    setSelectedItem(admin)
    setIsViewModalOpen(true)
  }

  const handleEdit = (admin: any) => {
    setSelectedItem(admin)
    setIsEditModalOpen(true)
  }

  // const [confirmDelete, setConfirmDelete] = useState<any>(null)

  const handleSave = async (event: any) => {
    event.preventDefault();
    const form = event.target;

    const formData = {
      username: form.name.value,
      email: form.email.value,
      phoneNumber: form.phone.value,
      address: form.address.value,
      roleId: Number(selectedItem?.role?.id || form.role.value),
      ...(isAddModalOpen && { password: form.password?.value }), // chỉ thêm khi tạo mới
    };

    try {
      if (isAddModalOpen) {
        await axios.post("http://localhost:8080/api/users", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        toast.success("Thêm nhân viên thành công 🎉");
      } else if (isEditModalOpen) {
        await axios.patch(
          `http://localhost:8080/api/users/${selectedItem.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Cập nhật nhân viên thành công ✅");
      }

      fetchAdmins();
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
    } catch (error) {
      toast.error("Lưu thất bại ⚠️");
      console.error(error);
    }
  };

  const handleDeleteAdmin = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xoá nhân viên này?")) return
    try {
      const token = localStorage.getItem("token")
      await axios.delete(`http://localhost:8080/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      toast.success("Xoá nhân viên thành công!")
      fetchAdmins()
    } catch (error) {
      console.error("Lỗi khi xoá nhân viên:", error)
      toast.error("Không thể xoá nhân viên. Vui lòng thử lại!")
    }
  }


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Quản lý nhân viên</h2>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm nhân viên
        </Button>
      </div>

      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <UserCog className="h-5 w-5 text-orange-500" />
              Danh sách nhân viên
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm nhân viên..."
                className="pl-8 w-64 border-gray-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedAdmins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium text-gray-900">{admin.username}</TableCell>
                  <TableCell className="text-gray-600">{admin.email}</TableCell>
                  <TableCell className="text-gray-600">{admin.phoneNumber}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        admin.role?.name?.toLowerCase() === "admin" ||
                          admin.role?.name?.toLowerCase() === "quản trị viên"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }
                    >
                      {admin.role?.name?.toLowerCase() === "admin" ||
                        admin.role?.name?.toLowerCase() === "quản trị viên"
                        ? "Quản trị viên"
                        : "Nhân viên"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(admin)}
                        className="hover:bg-blue-50 text-blue-600"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(admin)}
                        className="hover:bg-orange-50 text-orange-600"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:bg-red-50 text-red-600" onClick={() => handleDeleteAdmin(admin.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={setRowsPerPage}
            totalItems={filteredAdmins.length}
          />
        </CardContent>
      </Card>

      {/* View Admin Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-500" />
              Chi tiết nhân viên
            </DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Tên:</span>
                  <p className="text-gray-900 mt-1">{selectedItem.username}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Email:</span>
                  <p className="text-gray-900 mt-1">{selectedItem.email}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Số điện thoại:</span>
                  <p className="text-gray-900 mt-1">{selectedItem.phoneNumber}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600 w-full">Vai trò: </span>
                  <Badge
                    className={
                      selectedItem.role?.name?.toLowerCase() === "admin" ||
                        selectedItem.role?.name?.toLowerCase() === "quản trị viên"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-blue-100 text-blue-800"
                    }
                  >
                    {selectedItem.role?.name?.toLowerCase() === "admin" ||
                      selectedItem.role?.name?.toLowerCase() === "quản trị viên"
                      ? "Quản trị viên"
                      : "Nhân viên"}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <span className="font-medium text-gray-600">Địa chỉ:</span>
                  <p className="text-gray-900 mt-1">{selectedItem.address}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <h4 className="font-semibold text-gray-900 mb-2">Phân quyền:</h4>
                <div className="space-y-2 text-sm">
                  {Number(selectedItem.role?.id) === 1 ? (
                    <>
                      <p className="text-gray-600">✓ Toàn quyền quản lý hệ thống</p>
                      <p className="text-gray-600">✓ Quản lý nhân viên</p>
                      <p className="text-gray-600">✓ Xem và chỉnh sửa tất cả dữ liệu</p>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-600">✓ Xem tất cả dữ liệu</p>
                      <p className="text-gray-600">✓ Quản lý đơn hàng</p>
                      <p className="text-gray-600">✓ Xem thông tin khách hàng</p>
                      <p className="text-gray-400">✗ Không thể quản lý nhân viên</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add/Edit Admin Modal */}
      <Dialog
        open={isAddModalOpen || isEditModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddModalOpen(false)
            setIsEditModalOpen(false)
            setSelectedItem(null)
          }
        }}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isAddModalOpen ? (
                <Plus className="h-5 w-5 text-green-500" />
              ) : (
                <Edit className="h-5 w-5 text-orange-500" />
              )}
              {isAddModalOpen ? "Thêm nhân viên mới" : "Chỉnh sửa nhân viên"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Tên nhân viên</Label>
                  <Input
                    id="name"
                    placeholder="Nhập tên"
                    defaultValue={selectedItem?.username || ""}
                    className="border-gray-200"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    defaultValue={selectedItem?.email || ""}
                    className="border-gray-200"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    placeholder="0901234567"
                    defaultValue={selectedItem?.phoneNumber || ""}
                    className="border-gray-200"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Vai trò</Label>
                  <Select
                    defaultValue={selectedItem?.role?.id?.toString() || ""}
                    onValueChange={(v) =>
                      setSelectedItem({ ...selectedItem, role: { id: Number(v) } })
                    }
                  >
                    <SelectTrigger className="border-gray-200 w-full">
                      <SelectValue placeholder="Chọn vai trò" /> {/* 👈 Hiển thị khi chưa chọn */}
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem
                          key={role.id}
                          value={role.id.toString()}
                          disabled={role.id === 1} // ✅ disable nếu id = 1
                        >
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                  id="address"
                  placeholder="Nhập địa chỉ"
                  defaultValue={selectedItem?.address || ""}
                  className="border-gray-200"
                />
              </div>
              {isAddModalOpen && (
                <div>
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Input id="password" type="password" placeholder="Nhập mật khẩu" className="border-gray-200" />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                type="submit"
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
              >
                {isAddModalOpen ? "Thêm nhân viên" : "Cập nhật"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div >
  )
}

function CategoriesTab({
  selectedItem,
  setSelectedItem,
  isEditModalOpen,
  setIsEditModalOpen,
  isAddModalOpen,
  setIsAddModalOpen,
  searchQuery,
  setSearchQuery,
}: any) {
  const [categories, setCategories] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // 🔹 Hàm lấy dữ liệu thương hiệu từ API
  const fetchCategories = async () => {
    if (!token) return
    try {
      const response = await axios.get("http://localhost:8080/api/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })

      const data = response.data.result || []

      const sortedCategories = data.sort((a: any, b: any) => b.id - a.id)

      setCategories(sortedCategories)
    } catch (err) {
      console.error("Error fetching brands:", err)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [token])

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredCategories.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedCategories = filteredCategories.slice(startIndex, startIndex + rowsPerPage)

  // 🔹 Hàm thêm / cập nhật
  const handleSave = async (name: string) => {
    try {
      if (isAddModalOpen) {
        await axios.post(
          "http://localhost:8080/api/categories",
          { name },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      } else if (isEditModalOpen && selectedItem) {
        await axios.patch(
          `http://localhost:8080/api/categories/${selectedItem.id}`,
          { name },
          { headers: { Authorization: `Bearer ${token}` } }
        )
      }
      await fetchCategories()
      setIsAddModalOpen(false)
      setIsEditModalOpen(false)
      setSelectedItem(null)
    } catch (err) {
      console.error("Error saving category:", err)
    }
  }

  // 🔹 Hàm xóa danh mục
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setCategories(categories.filter((cat) => cat.id !== id))
    } catch (err) {
      console.error("Error deleting category:", err)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm danh mục..."
            className="pl-8 border-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm danh mục
        </Button>
      </div>

      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên danh mục</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCategories.length > 0 ? (
                paginatedCategories.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell className="font-medium text-gray-900">
                      {cat.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedItem(cat)
                            setIsEditModalOpen(true)
                          }}
                          className="hover:bg-orange-50 text-orange-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:bg-red-50 text-red-600"
                          onClick={() =>
                            handleDelete(cat.id)
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="text-center text-gray-500"
                  >
                    Không có danh mục
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={setRowsPerPage}
            totalItems={filteredCategories.length}
          />
        </CardContent>
      </Card>

      {/* Add/Edit Category Modal with Brand Selection */}
      <Dialog
        open={isAddModalOpen || isEditModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddModalOpen(false)
            setIsEditModalOpen(false)
            setSelectedItem(null)
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isAddModalOpen ? (
                <Plus className="h-5 w-5 text-green-500" />
              ) : (
                <Edit className="h-5 w-5 text-orange-500" />
              )}
              {isAddModalOpen ? "Thêm danh mục mới" : "Chỉnh sửa danh mục"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="category-name">Tên danh mục</Label>
              <Input
                id="category-name"
                placeholder="Nhập tên danh mục"
                defaultValue={selectedItem?.name || ""}
                className="border-gray-200"
                onChange={(e) =>
                  setSelectedItem((prev: any) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
              onClick={() =>
                handleSave(selectedItem?.name || "")
              }
            >
              {isAddModalOpen ? "Thêm danh mục" : "Cập nhật"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function BrandsTab({
  selectedItem,
  setSelectedItem,
  isEditModalOpen,
  setIsEditModalOpen,
  isAddModalOpen,
  setIsAddModalOpen,
  searchQuery,
  setSearchQuery,
}: any) {

  const [brands, setBrands] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null


  const fetchBrands = async () => {
    if (!token) return
    try {
      const params: any = {
        page: currentPage,
        size: rowsPerPage
      }

      if (searchQuery) {
        params.searchKey = searchQuery
      }

      const response = await axios.get(
        "http://localhost:8080/api/brands",
        {
          params,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = response.data

      setBrands(data.result || [])
      setTotalPages(data.meta?.totalPages || 1)
      setTotalItems(data.meta?.totalElements || 0)

    } catch (error) {
      console.error("Error fetching brands:", error)
    }
  }


  useEffect(() => {
    if (token) {
      fetchBrands()
    }
  }, [searchQuery, currentPage, rowsPerPage, token])


  // thêm / update
  const handleSave = async (name: string) => {
    try {
      if (isAddModalOpen) {
        await axios.post(
          "http://localhost:8080/api/brands",
          { name },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      }

      if (isEditModalOpen && selectedItem) {
        await axios.put(
          `http://localhost:8080/api/brands/${selectedItem.id}`,
          { name },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )

      }

      fetchBrands()
      setIsAddModalOpen(false)
      setIsEditModalOpen(false)
      setSelectedItem(null)
    } catch (error) {
      console.error("Error saving brand:", error)
    }
  }


  // delete
  const handleDelete = async (id: number) => {
    try {

      await axios.delete(
        `http://localhost:8080/api/brands/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      fetchBrands()
    } catch (error) {
      console.error("Error deleting brand:", error)
    }

  }


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm thương hiệu..."
            className="pl-8 border-gray-200"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
          />
        </div>

        <Button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-gradient-to-r from-orange-500 to-red-500 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm thương hiệu
        </Button>
      </div>


      <Card className="shadow-lg border-0 bg-white/80">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên thương hiệu</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>

              {brands.length > 0 ? (
                brands.map((brand) => (
                  <TableRow key={brand.id}>
                    <TableCell className="font-medium text-gray-900">
                      {brand.name}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedItem(brand)
                            setIsEditModalOpen(true)
                          }}
                          className="text-orange-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(brand.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>

                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-gray-500">
                    Không có thương hiệu
                  </TableCell>
                </TableRow>
              )}

            </TableBody>
          </Table>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(size) => {
              setRowsPerPage(size)
              setCurrentPage(1)
            }}
            totalItems={totalItems}
          />
        </CardContent>
      </Card>


      {/* Modal Add / Edit */}
      <Dialog
        open={isAddModalOpen || isEditModalOpen}
        onOpenChange={(open) => {

          if (!open) {
            setIsAddModalOpen(false)
            setIsEditModalOpen(false)
            setSelectedItem(null)
          }

        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isAddModalOpen
                ? "Thêm thương hiệu mới"
                : "Chỉnh sửa thương hiệu"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div>
              <Label>Tên thương hiệu</Label>
              <Input
                placeholder="Nhập tên thương hiệu"
                defaultValue={selectedItem?.name || ""}
                onChange={(e) =>
                  setSelectedItem((prev: any) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <DialogFooter>

            <Button
              className="bg-gradient-to-r from-orange-500 to-red-500"
              onClick={() => handleSave(selectedItem?.name || "")}
            >
              {isAddModalOpen ? "Thêm thương hiệu" : "Cập nhật"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// ... existing code for ConfigurationsTab with search functionality added ...

function ConfigurationsTab({
  selectedItem,
  setSelectedItem,
  isViewModalOpen,
  setIsViewModalOpen,
  isEditModalOpen,
  setIsEditModalOpen,
  isAddModalOpen,
  setIsAddModalOpen,
  searchQuery,
  setSearchQuery,
}: any) {
  const [configurations, setConfigurations] = useState<any[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [newSpecs, setNewSpecs] = useState<{ id?: number; name: string; value: string }[]>([])
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // 🔹 Hàm fetch dữ liệu cấu hình
  const fetchConfigurations = async () => {
    if (!token) return

    try {
      const response = await axios.get(
        "http://localhost:8080/api/configurations",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      const data = response.data.result || []

      const sortedConfigs = data.sort((a: any, b: any) => b.id - a.id)

      setConfigurations(sortedConfigs)
    } catch (err) {
      console.error("Error fetching configurations:", err)
    }
  }

  // 🔹 Fetch thông số kỹ thuật theo cấu hình ID
  const fetchSpecifications = async (configId: number) => {
    if (!token) return
    try {
      const response = await axios.get(
        `http://localhost:8080/api/specifications/configuration/${configId}?includeDeleted=false`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const specs = response.data.result || []

      setNewSpecs(
        specs.map((s: any) => ({
          id: s.id,
          name: s.name,
          value: s.value,
        }))
      )
    } catch (err) {
      console.error("Error fetching specs:", err)
      setNewSpecs([])
    }
  }

  useEffect(() => {
    fetchConfigurations()
  }, [token])



  // ✅ Tìm kiếm
  const filteredConfigs = configurations.filter(
    (config) =>
      config.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filteredConfigs.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedConfigs = filteredConfigs.slice(startIndex, startIndex + rowsPerPage)

  // 🔹 Khi click “Edit”
  const handleEditClick = async (config: any) => {
    setSelectedItem(config)
    setIsEditModalOpen(true)
    await fetchSpecifications(config.id)
  }

  // 🔹 Lưu cấu hình mới
  const handleSaveAddConfiguration = async () => {
    if (!token) return
    try {
      // 1️⃣ Thêm cấu hình
      const res = await axios.post(
        "http://localhost:8080/api/configurations",
        { name: selectedItem?.name || "Cấu hình mới" },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const configId = res.data?.result?.id || res.data?.id
      if (!configId) throw new Error("Không lấy được ID cấu hình mới")

      // 2️⃣ Thêm thông số kỹ thuật
      await Promise.all(
        newSpecs.map((spec) =>
          axios.post(
            "http://localhost:8080/api/specifications",
            { name: spec.name, value: spec.value, configurationId: configId },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        )
      )

      await fetchConfigurations()
      setIsAddModalOpen(false)
      setNewSpecs([])
    } catch (err) {
      console.error("Error adding configuration:", err)
    }
  }

  // 🔹 Cập nhật cấu hình
  const handleSaveEditConfiguration = async () => {
    if (!token || !selectedItem) return
    try {
      // 1️⃣ Cập nhật cấu hình
      await axios.put(
        `http://localhost:8080/api/configurations/${selectedItem.id}`,
        { name: selectedItem.name },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      // 2️⃣ Cập nhật hoặc thêm thông số kỹ thuật
      await Promise.all(
        newSpecs.map(async (spec) => {
          if (spec.id) {
            // PUT cập nhật
            return axios.put(
              `http://localhost:8080/api/specifications/${spec.id}`,
              { name: spec.name, value: spec.value },
              { headers: { Authorization: `Bearer ${token}` } }
            )
          } else {
            // POST mới
            return axios.post(
              "http://localhost:8080/api/specifications",
              { name: spec.name, value: spec.value, configurationId: selectedItem.id },
              { headers: { Authorization: `Bearer ${token}` } }
            )
          }
        })
      )

      await fetchConfigurations()
      setIsEditModalOpen(false)
      setSelectedItem(null)
      setNewSpecs([])
    } catch (err) {
      console.error("Error updating configuration:", err)
    }
  }

  const handleAddSpec = () => {
    setNewSpecs([...newSpecs, { name: "", value: "" }])
  }

  const handleRemoveSpec = (index: number) => {
    setNewSpecs(newSpecs.filter((_, i) => i !== index))
  }

  const handleUpdateSpec = (index: number, field: "name" | "value", value: string) => {
    const updated = [...newSpecs]
    updated[index][field] = value
    setNewSpecs(updated)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm cấu hình..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-gray-200"
          />
        </div>
        <Button
          onClick={() => {
            setIsAddModalOpen(true)
            setNewSpecs([])
          }}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm cấu hình
        </Button>
      </div>

      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="font-semibold text-gray-900">Tên cấu hình</TableHead>
                <TableHead className="font-semibold text-gray-900 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedConfigs.map((config) => (
                <TableRow key={config.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900 py-4">{config.name}</TableCell>
                  <TableCell className="text-right py-4">
                    <div className="flex justify-end gap-2">
                      {/* <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedItem(config)
                                                    setIsViewModalOpen(true)
                                                }}
                                                className="hover:bg-blue-50"
                                            >
                                                <Eye className="h-4 w-4 text-blue-500" />
                                            </Button> */}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditClick(config)}
                        className="hover:bg-orange-50"
                      >
                        <Edit className="h-4 w-4 text-orange-500" />
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:bg-red-50">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={setRowsPerPage}
        totalItems={filteredConfigs.length}
      />

      {/* <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Wrench className="h-5 w-5 text-blue-500" />
                            Chi tiết cấu hình
                        </DialogTitle>
                    </DialogHeader>
                    {selectedItem && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="font-medium text-gray-600">Tên cấu hình:</span>
                                    <p className="text-gray-900 font-semibold">{selectedItem.name}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600">Sản phẩm:</span>
                                    <p className="text-gray-900">{selectedItem.product_name}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600">Giá:</span>
                                    <p className="text-orange-600 font-bold">₫{selectedItem.price?.toLocaleString()}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600">Config ID:</span>
                                    <p className="text-gray-900">#{selectedItem.id}</p>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Settings className="h-4 w-4 text-orange-500" />
                                    Thông số kỹ thuật
                                </h4>
                                {(() => {
                                    const specs = mockData.specifications.filter((s) => s.config_id === selectedItem.id)
                                    if (specs.length === 0) {
                                        return <p className="text-sm text-gray-500">Chưa có thông số kỹ thuật nào.</p>
                                    }
                                    return (
                                        <div className="grid grid-cols-2 gap-3">
                                            {specs.map((spec) => (
                                                <div key={spec.id} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                                    <span className="text-sm font-medium text-gray-600">{spec.name}:</span>
                                                    <p className="text-sm text-gray-900 mt-1 font-medium">{spec.value}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )
                                })()}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog> */}

      <Dialog
        open={isAddModalOpen || isEditModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddModalOpen(false)
            setIsEditModalOpen(false)
            setSelectedItem(null)
            setNewSpecs([])
          }
        }}
      >
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isAddModalOpen ? (
                <Plus className="h-5 w-5 text-green-500" />
              ) : (
                <Edit className="h-5 w-5 text-orange-500" />
              )}
              {isAddModalOpen ? "Thêm cấu hình mới" : "Chỉnh sửa cấu hình"}
            </DialogTitle>
            <DialogDescription>
              {isAddModalOpen ? "Nhập thông tin chi tiết cho cấu hình mới" : "Cập nhật thông tin cấu hình"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="config-name">Tên cấu hình</Label>
                <Input
                  id="config-name"
                  placeholder="Nhập tên cấu hình"
                  value={selectedItem?.name || ""}
                  onChange={(e) =>
                    setSelectedItem({
                      ...selectedItem,
                      name: e.target.value,
                    })
                  }
                  className="border-gray-200"
                />
              </div>
              {/* <div>
                                <Label htmlFor="product">Sản phẩm</Label>
                                <Select defaultValue={selectedItem?.product_id?.toString() || ""}>
                                    <SelectTrigger className="border-gray-200">
                                        <SelectValue placeholder="Chọn sản phẩm" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mockData.products.map((product) => (
                                            <SelectItem key={product.id} value={product.id.toString()}>
                                                {product.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div> */}
            </div>

            {/* <div>
                            <Label htmlFor="price">Giá</Label>
                            <Input
                                id="price"
                                type="number"
                                placeholder="0"
                                defaultValue={selectedItem?.price || ""}
                                className="border-gray-200"
                            />
                        </div> */}

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Thông số kỹ thuật</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSpec}
                  className="border-orange-500 text-orange-600 hover:bg-orange-50 bg-transparent"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Thêm thông số
                </Button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {newSpecs.map((spec, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <Input
                      placeholder="Tên thông số"
                      value={spec.name}
                      onChange={(e) => handleUpdateSpec(idx, "name", e.target.value)}
                      className="flex-1 border-gray-200"
                    />
                    <Input
                      placeholder="Giá trị"
                      value={spec.value}
                      onChange={(e) => handleUpdateSpec(idx, "value", e.target.value)}
                      className="flex-1 border-gray-200"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSpec(idx)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {newSpecs.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Chưa có thông số nào. Nhấn "Thêm thông số" để bắt đầu.
                  </p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              onClick={isAddModalOpen ? handleSaveAddConfiguration : handleSaveEditConfiguration}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              {isAddModalOpen ? "Thêm cấu hình" : "Cập nhật cấu hình"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SettingsTab({
  selectedItem,
  setSelectedItem,
  isViewModalOpen,
  setIsViewModalOpen,
  isEditModalOpen,
  setIsEditModalOpen,
  isAddModalOpen,
  setIsAddModalOpen,
}: any) {
  const [activeInventoryTab, setActiveInventoryTab] = useState("configurations")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Cài đặt hệ thống</h2>

      <Tabs value={activeInventoryTab} onValueChange={setActiveInventoryTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="configurations">Cấu hình</TabsTrigger>
          <TabsTrigger value="categories">Danh mục</TabsTrigger>
          <TabsTrigger value="brands">Thương hiệu</TabsTrigger>
        </TabsList>

        <TabsContent value="configurations">
          <ConfigurationsTab
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            isViewModalOpen={isViewModalOpen}
            setIsViewModalOpen={setIsViewModalOpen}
            isEditModalOpen={isEditModalOpen}
            setIsEditModalOpen={setIsEditModalOpen}
            isAddModalOpen={isAddModalOpen}
            setIsAddModalOpen={setIsAddModalOpen}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </TabsContent>

        <TabsContent value="categories">
          <CategoriesTab
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            isEditModalOpen={isEditModalOpen}
            setIsEditModalOpen={setIsEditModalOpen}
            isAddModalOpen={isAddModalOpen}
            setIsAddModalOpen={setIsAddModalOpen}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </TabsContent>

        <TabsContent value="brands">
          <BrandsTab
            selectedItem={selectedItem}
            setSelectedItem={setSelectedItem}
            isEditModalOpen={isEditModalOpen}
            setIsEditModalOpen={setIsEditModalOpen}
            isAddModalOpen={isAddModalOpen}
            setIsAddModalOpen={setIsAddModalOpen}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("admin_active_tab") || "overview"
    }
    return "overview"
  })
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [selectedConfigs, setSelectedConfigs] = useState<number[]>([])
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [configQuantities, setConfigQuantities] = useState<Record<number, number>>({})
  const [configPrices, setConfigPrices] = useState<Record<number, number>>({})


  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    localStorage.setItem("admin_active_tab", tabId)
    setIsViewModalOpen(false)
    setIsEditModalOpen(false)
    setIsAddModalOpen(false)
    setIsDeleteDialogOpen(false)
    setIsImportModalOpen(false)
    setSelectedItem(null)
    setConfigQuantities({})
    setConfigPrices({})
  }

  const handleConfigQuantityChange = (configId: number, quantity: number) => {
    setConfigQuantities((prev) => ({
      ...prev,
      [configId]: quantity,
    }))
  }

  const handleConfigPriceChange = (configId: number, price: number) => {
    setConfigPrices((prev) => ({
      ...prev,
      [configId]: price,
    }))
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-xs text-gray-500">Quản lý hệ thống</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: "overview", label: "Tổng quan", icon: LayoutDashboard },
            { id: "products", label: "Sản phẩm", icon: Package },
            { id: "orders", label: "Đơn hàng", icon: ShoppingCart },
            { id: "customers", label: "Khách hàng", icon: Users },
            { id: "admins", label: "Nhân viên", icon: UserCog },
            { id: "images", label: "Quản lý ảnh", icon: ImageIcon },
            { id: "settings", label: "Cài đặt", icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === item.id
                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md"
                : "text-gray-600 hover:bg-gray-100"
                }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Đăng xuất
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {activeTab === "overview" && "Tổng quan"}
                {activeTab === "products" && "Quản lý sản phẩm"}
                {activeTab === "orders" && "Quản lý đơn hàng"}
                {activeTab === "customers" && "Quản lý khách hàng"}
                {activeTab === "admins" && "Quản lý nhân viên"}
                {activeTab === "images" && "Quản lý ảnh"}
                {activeTab === "settings" && "Cài đặt"}
              </h2>
              <p className="text-sm text-gray-500 mt-1">Chào mừng trở lại, Admin</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Xuất báo cáo
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8">
          {activeTab === "overview" && <OverviewTab />}
          {activeTab === "products" && (
            <ProductsTab
              handleConfigQuantityChange={handleConfigQuantityChange}
              setConfigQuantities={setConfigQuantities}
              configPrices={configPrices}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              isViewModalOpen={isViewModalOpen}
              setIsViewModalOpen={setIsViewModalOpen}
              isEditModalOpen={isEditModalOpen}
              setIsEditModalOpen={setIsEditModalOpen}
              isAddModalOpen={isAddModalOpen}
              setIsAddModalOpen={setIsAddModalOpen}
              uploadedImages={uploadedImages}
              setUploadedImages={setUploadedImages}
              selectedConfigs={selectedConfigs}
              setSelectedConfigs={setSelectedConfigs}
              configQuantities={configQuantities}
              setConfigPrices={setConfigPrices}
              isImportModalOpen={isImportModalOpen}
              setIsImportModalOpen={setIsImportModalOpen}
              handleConfigPriceChange={handleConfigPriceChange}
            />
          )}
          {activeTab === "orders" && (
            <OrdersTab
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              isViewModalOpen={isViewModalOpen}
              setIsViewModalOpen={setIsViewModalOpen}
            />
          )}
          {activeTab === "customers" && (
            <CustomersTab
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              isViewModalOpen={isViewModalOpen}
              setIsViewModalOpen={setIsViewModalOpen}
              isEditModalOpen={isEditModalOpen}
              setIsEditModalOpen={setIsEditModalOpen}
              isAddModalOpen={isAddModalOpen}
              setIsAddModalOpen={setIsAddModalOpen}
            />
          )}
          {activeTab === "admins" && (
            <AdminsTab
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              isViewModalOpen={isViewModalOpen}
              setIsViewModalOpen={setIsViewModalOpen}
              isEditModalOpen={isEditModalOpen}
              setIsEditModalOpen={setIsEditModalOpen}
              isAddModalOpen={isAddModalOpen}
              setIsAddModalOpen={setIsAddModalOpen}
            />
          )}
          {activeTab === "images" && (
            <ImagesTab
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              isViewModalOpen={isViewModalOpen}
              setIsViewModalOpen={setIsViewModalOpen}
              isEditModalOpen={isEditModalOpen}
              setIsEditModalOpen={setIsEditModalOpen}
            />
          )}
          {activeTab === "settings" && (
            <SettingsTab
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
              isViewModalOpen={isViewModalOpen}
              setIsViewModalOpen={setIsViewModalOpen}
              isEditModalOpen={isEditModalOpen}
              setIsEditModalOpen={setIsEditModalOpen}
              isAddModalOpen={isAddModalOpen}
              setIsAddModalOpen={setIsAddModalOpen}
            />
          )}
        </main>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa mục này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600">Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
