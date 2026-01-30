"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft, Clock, CheckCircle, Truck, Package, XCircle, User, Phone,
  Mail, MapPin, Calendar, CreditCard
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const orderId = Number(params.id)
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/orders/${orderId}`)
        setOrder(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [orderId])

  if (loading) return <p className="p-6">Đang tải...</p>
  if (!order) return <p className="p-6">Không tìm thấy đơn hàng</p>

  const orderItems = order.orderDetails || []

  const statusMap: any = {
    0: { text: "Không xác định", color: "bg-gray-50 text-gray-700", icon: <Package className="h-5 w-5" /> },
    1: { text: "Chờ xử lý", color: "bg-amber-50 text-amber-700", icon: <Clock className="h-5 w-5" /> },
    2: { text: "Đã xác nhận", color: "bg-blue-50 text-blue-700", icon: <CheckCircle className="h-5 w-5" /> },
    3: { text: "Đang giao hàng", color: "bg-indigo-50 text-indigo-700", icon: <Truck className="h-5 w-5" /> },
    4: { text: "Đã giao", color: "bg-emerald-50 text-emerald-700", icon: <Package className="h-5 w-5" /> },
    5: { text: "Đã huỷ", color: "bg-red-50 text-red-700", icon: <XCircle className="h-5 w-5" /> },
  }

  const currentStatus = statusMap[order.status] || statusMap[0]

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString("vi-VN") + " " + d.toLocaleTimeString("vi-VN", { hour12: false })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">

        {/* Back */}
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Đơn hàng {order.orderCode}</h1>
            <p className="text-gray-600 mt-1">Ngày đặt: {formatDate(order.createdDate)}</p>
          </div>

          <div className={`flex items-center gap-3 px-6 py-3 rounded-full border font-semibold ${currentStatus.color}`}>
            {currentStatus.icon}
            {currentStatus.text}
          </div>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* Customer Info */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" /> Thông tin khách hàng
                </h2>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Tên khách hàng</p>
                    <p className="font-semibold text-gray-900">{order.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Số điện thoại</p>
                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {order.customerPhone}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      {order.customerEmail || "Không có"}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Địa chỉ giao hàng</p>
                    <p className="font-semibold flex items-start gap-2 text-gray-900">
                      <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                      {order.customerAddress}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardContent className="p-8">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" /> Chi tiết sản phẩm
                </h2>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {orderItems.map((item: any) => {
                    const product = item.productDetail.product
                    const config = item.productDetail.configuration
                    const mainImage = product.images.find((img: any) => img.isMain) || product.images[0]

                    return (
                      <div key={item.id} className="flex gap-4 p-4 bg-slate-50 rounded-lg border">
                        <Image
                          src={mainImage.imageUrl}
                          alt={product.name}
                          width={100}
                          height={100}
                          className="rounded-lg object-cover"
                        />

                        <div className="flex-1">
                          <p className="font-semibold">{product.name}</p>
                          <p className="text-sm text-gray-600">{config.name}</p>
                          <p className="text-xs text-gray-500">SL: {item.quantity}</p>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-orange-600">
                            ₫{item.unitPrice.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            Tổng: ₫{(item.unitPrice * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

          </div>

          {/* RIGHT SUMMARY */}
          <Card className="sticky top-8">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold mb-6">Tóm tắt đơn hàng</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Tổng sản phẩm:</span>
                  <span>
                    ₫{orderItems
                      .reduce((sum: number, i: any) => sum + i.unitPrice * i.quantity, 0)
                      .toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>VAT:</span>
                  <span>₫{order.vat?.toLocaleString() || 0}</span>
                </div>

                <div className="flex justify-between">
                  <span>Giảm giá:</span>
                  <span>₫0</span>
                </div>

                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Tổng cộng:</span>
                  <span className="text-orange-600 text-2xl">
                    ₫{order.totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
