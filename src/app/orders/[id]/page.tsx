"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function OrderDetailsPage() {
  const params = useParams()
  const orderId = Number(params.id)

  const [order, setOrder] = useState<any>(null)
  const [orderDetail, setOrderDetail] = useState<any>(null)
  const orderItems = orderDetail ? [orderDetail] : []
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const orderRes = await axios.get(
          `http://localhost:8080/api/orders/${orderId}`
        )
        setOrder(orderRes.data.result)

        const detailRes = await axios.get(
          `http://localhost:8080/api/order-details/${orderId}`
        )
        setOrderDetail(detailRes.data.result)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [orderId])


  if (loading) return <p className="p-10">Đang tải...</p>
  if (!order) return <p className="p-10">Không tìm thấy đơn hàng</p>

  const product = orderDetail?.productDetail?.product
  const config = orderDetail?.productDetail?.configuration


  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* BACK */}
        <Link href="/">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </Link>

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Đơn hàng #{order.orderCode}
          </h1>
          <p className="text-gray-500 mt-1">
            Ngày đặt: {new Date(order.createdDate).toLocaleString("vi-VN")}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="col-span-2 space-y-6">
            {/* CUSTOMER */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold mb-4">
                  Thông tin khách hàng
                </h2>
                <div className="space-y-2">
                  <p>
                    <b>Tên:</b> {order.customerName}
                  </p>
                  <p>
                    <b>Điện thoại:</b> {order.customerPhone}
                  </p>
                  <p>
                    <b>Địa chỉ:</b> {order.customerAddress}
                  </p>
                </div>
              </CardContent>
            </Card>


            {/* PRODUCT */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-bold mb-4">
                  Chi tiết sản phẩm
                </h2>
                {orderDetail && (
                  <div className="flex items-center justify-between border p-4 rounded-lg">
                    <div>
                      <p className="font-semibold">
                        {product?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Cấu hình: {config?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Số lượng: {orderDetail.quantity}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-orange-600">
                        ₫{orderDetail.unitPrice?.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        Tổng: ₫{(orderDetail.unitPrice * orderDetail.quantity).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

              </CardContent>
            </Card>

          </div>


          {/* RIGHT */}
          <Card className="h-fit">
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
                    ₫{order.totalPrice?.toLocaleString()}
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