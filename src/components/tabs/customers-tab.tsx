"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Search, Eye, Edit, Trash2, Plus, Users, Mail, Phone, MapPin, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Pagination } from "@/components/pagination"
import { mockData } from "@/lib/mock-data"

export function CustomersTab({
  selectedItem,
  setSelectedItem,
  isViewModalOpen,
  setIsViewModalOpen,
  isEditModalOpen,
  setIsEditModalOpen,
  isAddModalOpen,
  setIsAddModalOpen,
}: any) {
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState("")
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true)
        const res = await axios.get("http://localhost:8080/api/users/statistics")
        setCustomers(res.data)
      } catch (err) {
        console.error("Lỗi load customers", err)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])


  const filteredCustomers = customers.filter(
    (customer) =>
      customer.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phoneNumber.includes(searchQuery)
  )


  const totalPages = Math.ceil(filteredCustomers.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + rowsPerPage)

  const handleView = (customer: any) => {
    setSelectedItem(customer)
    setIsViewModalOpen(true)
  }

  const handleEdit = (customer: any) => {
    setSelectedItem(customer)
    setIsEditModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm khách hàng..."
            className="pl-10 border-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Card className="border border-gray-200 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-gray-200">
                <TableHead className="font-semibold text-gray-900">Tên khách hàng</TableHead>
                <TableHead className="font-semibold text-gray-900">Email</TableHead>
                <TableHead className="font-semibold text-gray-900">Số điện thoại</TableHead>
                <TableHead className="font-semibold text-gray-900">Tổng chi tiêu</TableHead>
                <TableHead className="font-semibold text-gray-900">Đơn hàng</TableHead>
                <TableHead className="font-semibold text-gray-900 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCustomers.map((customer) => (
                <TableRow key={customer.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900 py-4">{customer.username}</TableCell>
                  <TableCell className="text-gray-600 py-4">{customer.email}</TableCell>
                  <TableCell className="text-gray-600 py-4">{customer.phoneNumber}</TableCell>
                  <TableCell className="font-bold text-gray-900 py-4">
                    ₫{customer.totalSpent?.toLocaleString() || "0"}
                  </TableCell>
                  <TableCell className="text-gray-600 py-4">{customer.totalOrders} đơn</TableCell>
                  <TableCell className="text-right py-4">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(customer)}
                        className="hover:bg-blue-50"
                      >
                        <Eye className="h-4 w-4 text-blue-500" />
                      </Button>
                      {/* <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(customer)}
                        className="hover:bg-orange-50"
                      >
                        <Edit className="h-4 w-4 text-orange-500" />
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:bg-red-50">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button> */}
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
        totalItems={filteredCustomers.length}
      />

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-500" />
              Chi tiết khách hàng
            </DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Thông tin cá nhân
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Tên khách hàng:</span>
                      <p className="text-gray-900 font-medium">{selectedItem.username}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{selectedItem.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">{selectedItem.phoneNumber}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <span className="text-gray-900">{selectedItem.address}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Thống kê mua hàng
                  </h3>
                  <div className="space-y-3">
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{selectedItem.totalOrders}</div>
                      <div className="text-sm text-blue-600">Tổng đơn hàng</div>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        ₫{selectedItem.totalSpent?.toLocaleString() || "0"}
                      </div>
                      <div className="text-sm text-green-600">Tổng chi tiêu</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
              {isAddModalOpen ? "Thêm khách hàng mới" : "Chỉnh sửa khách hàng"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer-name">Tên khách hàng</Label>
                <Input
                  id="customer-name"
                  placeholder="Nhập tên khách hàng"
                  defaultValue={selectedItem?.name || ""}
                  className="border-gray-200"
                />
              </div>
              <div>
                <Label htmlFor="customer-email">Email</Label>
                <Input
                  id="customer-email"
                  type="email"
                  placeholder="email@example.com"
                  defaultValue={selectedItem?.mail || ""}
                  className="border-gray-200"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer-phone">Số điện thoại</Label>
                <Input
                  id="customer-phone"
                  placeholder="0901234567"
                  defaultValue={selectedItem?.phone_number || ""}
                  className="border-gray-200"
                />
              </div>
              <div>
                <Label htmlFor="customer-password">Mật khẩu</Label>
                <Input id="customer-password" type="password" placeholder="Nhập mật khẩu" className="border-gray-200" />
              </div>
            </div>
            <div>
              <Label htmlFor="customer-address">Địa chỉ</Label>
              <Textarea
                id="customer-address"
                placeholder="Nhập địa chỉ đầy đủ"
                defaultValue={selectedItem?.address || ""}
                className="border-gray-200"
              />
            </div>
          </div>
          <DialogFooter>
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
              {isAddModalOpen ? "Thêm khách hàng" : "Cập nhật khách hàng"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
