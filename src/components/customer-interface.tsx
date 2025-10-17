"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, ShoppingCart, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import Image from "next/image"

const mockData = {
  products: [
    {
      id: 1,
      name: "iPhone 15 Pro",
      img: "/modern-smartphone.png",
      amount: 50,
      description: "Điện thoại thông minh cao cấp với chip A17 Pro",
      category: "Điện thoại",
      brand: "Apple",
      configurations: [
        {
          id: 1,
          name: "iPhone 15 Pro 128GB",
          price: 25000000,
          specifications: [
            { id: 1, name: "Bộ nhớ", value: "128GB" },
            { id: 2, name: "RAM", value: "8GB" },
            { id: 3, name: "Màn hình", value: "6.1 inch Super Retina XDR" },
            { id: 4, name: "Camera", value: "48MP + 12MP + 12MP" },
          ],
        },
        {
          id: 2,
          name: "iPhone 15 Pro 256GB",
          price: 28000000,
          specifications: [
            { id: 5, name: "Bộ nhớ", value: "256GB" },
            { id: 6, name: "RAM", value: "8GB" },
            { id: 7, name: "Màn hình", value: "6.1 inch Super Retina XDR" },
            { id: 8, name: "Camera", value: "48MP + 12MP + 12MP" },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "MacBook Pro",
      img: "/macbook.jpg",
      amount: 30,
      description: "Laptop chuyên nghiệp với chip M3",
      category: "Laptop",
      brand: "Apple",
      configurations: [
        {
          id: 3,
          name: "MacBook Pro M3 512GB",
          price: 45000000,
          specifications: [
            { id: 9, name: "Chip", value: "Apple M3" },
            { id: 10, name: "RAM", value: "16GB" },
            { id: 11, name: "SSD", value: "512GB" },
            { id: 12, name: "Màn hình", value: "14 inch Liquid Retina XDR" },
          ],
        },
      ],
    },
  ],
}

interface CustomerInterfaceProps {
  onBack: () => void
}

export function CustomerInterface({ onBack }: CustomerInterfaceProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  const filteredProducts = mockData.products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Quay lại
              </Button>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Cửa hàng điện tử
              </h1>
            </div>
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Giỏ hàng
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-100 relative">
                <Image
                  src={product.img || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <Badge className="absolute top-2 right-2 bg-green-500">Còn {product.amount} sản phẩm</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
                <div className="flex gap-2">
                  <Badge variant="outline">{product.brand}</Badge>
                  <Badge variant="outline">{product.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {product.configurations.map((config) => (
                    <div key={config.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{config.name}</p>
                        <p className="text-lg font-bold text-orange-600">₫{config.price.toLocaleString()}</p>
                      </div>
                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedProduct({ ...product, selectedConfig: config })}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>{config.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Image
                                    src={product.img || "/placeholder.svg"}
                                    alt={product.name}
                                    className="w-full h-48 object-cover rounded-lg"
                                  />
                                </div>
                                <div className="space-y-3">
                                  <h3 className="font-semibold text-lg">Thông số kỹ thuật</h3>
                                  {config.specifications.map((spec) => (
                                    <div key={spec.id} className="flex justify-between py-2 border-b">
                                      <span className="text-gray-600">{spec.name}:</span>
                                      <span className="font-medium">{spec.value}</span>
                                    </div>
                                  ))}
                                  <div className="pt-4">
                                    <p className="text-2xl font-bold text-orange-600">
                                      ₫{config.price.toLocaleString()}
                                    </p>
                                    <Button className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                                      <ShoppingCart className="h-4 w-4 mr-2" />
                                      Thêm vào giỏ hàng
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}