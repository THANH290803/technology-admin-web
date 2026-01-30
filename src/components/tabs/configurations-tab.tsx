"use client"

import { useState } from "react"
import { Search, Eye, Edit, Trash2, Plus, X, Wrench, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination } from "@/components/pagination"
import { mockData } from "@/lib/mock-data"

export function ConfigurationsTab({
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
  const [currentPage, setCurrentPage] = useState(1)
  const [newSpecs, setNewSpecs] = useState<{ name: string; value: string }[]>([])
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const filteredConfigs = mockData.configurations.filter(
    (config) =>
      config.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (config.product_name && config.product_name.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const totalPages = Math.ceil(filteredConfigs.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedConfigs = filteredConfigs.slice(startIndex, startIndex + rowsPerPage)

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
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedItem(config)
                          setIsViewModalOpen(true)
                        }}
                        className="hover:bg-blue-50"
                      >
                        <Eye className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedItem(config)
                          setIsEditModalOpen(true)
                          setNewSpecs(config.specifications || [])
                        }}
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

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
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
                  <span className="font-medium text-gray-600">Giá:</span>
                  <p className="text-orange-600 font-bold">₫{selectedItem.price?.toLocaleString()}</p>
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
      </Dialog>

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
                  defaultValue={selectedItem?.name || ""}
                  className="border-gray-200"
                />
              </div>
              <div>
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
              </div>
            </div>

            <div>
              <Label htmlFor="price">Giá</Label>
              <Input
                id="price"
                type="number"
                placeholder="0"
                defaultValue={selectedItem?.price || ""}
                className="border-gray-200"
              />
            </div>

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
