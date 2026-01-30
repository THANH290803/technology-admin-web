"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Package, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { mockData } from "@/lib/mock-data"

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const productId = Number.parseInt(id)

  const router = useRouter()
  const [productData, setProductData] = useState<any[]>([])
  const [product, setProduct] = useState<any | null>(null)
  const [selectedConfigId, setSelectedConfigId] = useState<number | null>(null)
  const [selectedSpecs, setSelectedSpecs] = useState<any[]>([])
  const [selectedQuantity, setSelectedQuantity] = useState<number>(0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")
        const res = await fetch(`http://localhost:8080/api/product-details/product/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) throw new Error("Lỗi khi tải dữ liệu")
        const data = await res.json()
        setProductData(data)

        if (data.length > 0) setProduct(data[0].product)
      } catch (error) {
        console.error("❌ Lỗi khi gọi API:", error)
      }
    }
    fetchData()
  }, [productId])

  // if (!product) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 p-6">
  //       <div className="max-w-6xl mx-auto">
  //         <Button variant="ghost" onClick={() => router.back()} className="mb-8 text-gray-600 hover:text-gray-900">
  //           <ArrowLeft className="h-5 w-5 mr-2" />
  //           Quay lại
  //         </Button>
  //         <div className="text-center py-20">
  //           <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
  //           <p className="text-xl text-gray-500">Sản phẩm không tìm thấy</p>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  // Cập nhật selectedConfigId, selectedSpecs và quantity khi productData thay đổi
  useEffect(() => {
    if (productData.length === 0) return

    let pd
    if (selectedConfigId) {
      pd = productData.find((pd) => pd.configuration?.id === selectedConfigId)
    } else {
      pd = productData[0]
      setSelectedConfigId(pd.configuration.id)
    }

    if (pd) {
      setSelectedSpecs(pd.configuration?.specifications || [])
      setSelectedQuantity(pd.quantity)
    }
  }, [productData, selectedConfigId])

  const productConfigs = productData
  const selectedConfig = productConfigs.find((pd) => pd.configuration?.id === selectedConfigId)?.configuration

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">{product?.name}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Product Info */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-8">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-6">Thông tin sản phẩm</h2>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-200">
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-2">Thương hiệu</p>
                    <p className="text-lg font-semibold text-gray-900">{product?.brand.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-2">Danh mục</p>
                    <p className="text-lg font-semibold text-gray-900">{product?.category.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-2">Số lượng tồn kho</p>
                    <p className="text-lg font-semibold text-gray-900">{productData.reduce((sum, pd) => sum + (pd.quantity || 0), 0)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 font-medium mb-2">Ngày tạo</p>
                    <p className="text-lg font-semibold text-gray-900">{product?.created_at}</p>
                  </div>
                </div>

                {/* Description */}
                {product?.description && (
                  <div className="mb-8 pb-8 border-b border-gray-200">
                    <p className="text-sm text-gray-600 font-medium mb-3">Mô tả</p>
                    <p className="text-gray-700 leading-relaxed">{product?.description}</p>
                  </div>
                )}

                {/* Image */}
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-4">Hình ảnh</p>
                  <div className="rounded-lg p-6 flex items-center justify-center min-h-64">
                    {product?.images?.length > 0 ? (
                      <Image
                        src={product.images.find((img: any) => img.isMain)?.imageUrl || "/placeholder.svg"}
                        alt={product?.name}
                        width={1000}
                        height={100}
                        className="max-w-full max-h-64 object-contain"
                      />
                    ) : (
                      <Package className="h-16 w-16 text-gray-300" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Specifications */}
          <div>
            <div className="bg-white rounded-lg border border-gray-200 p-8 sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Thông số kỹ thuật</h2>

              {selectedConfig ? (
                <div className="space-y-6">
                  <div className="pb-6 border-b border-gray-200">
                    <p className="text-xs text-gray-600 font-medium uppercase tracking-wide mb-2">Cấu hình</p>
                    <p className="text-base font-semibold text-gray-900 mb-3">{selectedConfig.name}</p>
                    {(() => {
                      const selectedProductDetail = productData.find(
                        (pd) => pd.configuration?.id === selectedConfigId
                      );
                      return (
                        <p className="text-2xl font-bold text-orange-600">
                          ₫{selectedProductDetail?.price?.toLocaleString() || 0}
                        </p>
                      );
                    })()}
                  </div>

                  {selectedSpecs.length > 0 ? (
                    <div className="space-y-4">
                      {selectedSpecs.map((spec) => (
                        <div key={spec.id}
                          className="flex justify-between items-center py-1 border-b border-gray-100 last:border-b-0"
                        >
                          <p className="text-xs text-gray-600 font-medium uppercase tracking-wide mb-1">{spec.name}</p>
                          <p className="text-base font-semibold text-gray-900">{spec.value}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Zap className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Không có thông số kỹ thuật</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">Chọn một cấu hình</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Configurations Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Cấu hình sản phẩm</h2>

          {productConfigs.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Không có cấu hình nào</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {productConfigs.map((pd) => {
                const config = pd.configuration
                const isSelected = selectedConfigId === config?.id
                return (
                  <button
                    key={pd.id}
                    onClick={() => setSelectedConfigId(config?.id || null)}
                    className={`text-left p-4 rounded-lg border-2 transition-all ${isSelected ? "border-orange-500 bg-orange-50" : "border-gray-200 bg-white hover:border-orange-300"
                      }`}
                  >
                    <p className={`font-semibold mb-2 ${isSelected ? "text-orange-900" : "text-gray-900"}`}>
                      {config?.name}
                    </p>
                    <p className="text-orange-600 font-bold">₫{pd.price.toLocaleString()}</p>
                    <p className="text-gray-600 text-sm">Số lượng: {pd.quantity}</p>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
