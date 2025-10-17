"use client"

import { useState } from "react"
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
    BarChart3,
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
    Upload,
    Users,
    Wrench,
    X,
    LayoutDashboard,
    UserCog,
    DollarSign,
    ShoppingBag,
    UserCheck,
    TrendingUp,
    Download,
    FileUp,
    Filter,
    Star,
    Mail,
    Phone,
    MapPin,
    FileSpreadsheet,
    FileText,
    Check,
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
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"

const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

const mockData = {
    brands: [
        { id: 1, name: "Apple" },
        { id: 2, name: "Samsung" },
        { id: 3, name: "Dell" },
    ],
    categories: [
        { id: 1, name: "Điện thoại", brand_id: 1 },
        { id: 2, name: "Laptop", brand_id: 3 },
    ],
    products: [
        {
            id: 1,
            name: "iPhone 15 Pro Max",
            img: "/iphone-15-pro.jpg",
            amount: 50,
            created_at: "2024-01-15",
            description: "Điện thoại cao cấp với chip A17 Pro",
            cat_id: 1,
            brand_id: 1,
            brand: "Apple",
            category: "Điện thoại",
            images: ["/iphone-15-pro-1.jpg", "/iphone-15-pro-2.jpg", "/iphone-15-pro-3.jpg"],
            stock: 50, // Added stock for products
            image: "/iphone-15-pro.jpg", // Added image for products
            price: 34990000, // Added price for products
        },
        {
            id: 2,
            name: "MacBook Pro 16",
            img: "/macbook.jpg",
            amount: 30,
            created_at: "2024-01-20",
            description: "Laptop chuyên nghiệp với chip M3 Max",
            cat_id: 2,
            brand_id: 1,
            brand: "Apple",
            category: "Laptop",
            images: ["/macbook.jpg"],
            stock: 30, // Added stock for products
            image: "/macbook.jpg", // Added image for products
            price: 89990000, // Added price for products
        },
    ],
    configurations: [
        { id: 1, name: "256GB - Titan Tự Nhiên", price: 34990000, product_id: 1 },
        { id: 2, name: "512GB - Titan Xanh", price: 39990000, product_id: 1 },
        { id: 3, name: "32GB RAM - 1TB SSD", price: 89990000, product_id: 2 },
    ],
    specifications: [
        { id: 1, name: "RAM", value: "8GB", config_id: 1 },
        { id: 2, name: "Chip", value: "A17 Pro", config_id: 1 },
        { id: 3, name: "RAM", value: "8GB", config_id: 2 },
        { id: 4, name: "Chip", value: "A17 Pro", config_id: 2 },
        { id: 5, name: "CPU", value: "M3 Max", config_id: 3 },
        { id: 6, name: "GPU", value: "40-core", config_id: 3 },
    ],
    product_details: [
        { id: 1, product_id: 1, config_id: 1 },
        { id: 2, product_id: 1, config_id: 2 },
        { id: 3, product_id: 2, config_id: 3 },
    ],
    orders: [
        {
            id: 1,
            status: 2,
            purchase_date: "2024-01-25",
            payment_id: 1,
            admin_id: 1,
            customer_id: 1,
            customer_name: "Nguyễn Văn A",
            total: 34990000,
            order_date: "2024-01-25",
            phone: "0901234567",
            email: "nguyenvana@email.com",
            address: "123 Đường ABC, Quận 1, TP.HCM",
            status_text: "Đang giao",
            payment_method: "Thanh toán khi nhận hàng",
        },
        {
            id: 2,
            status: 1,
            purchase_date: "2024-01-26",
            payment_id: 1,
            admin_id: 1,
            customer_id: 2,
            customer_name: "Trần Thị B",
            total: 89990000,
            order_date: "2024-01-26",
            phone: "0907654321",
            email: "tranthib@email.com",
            address: "456 Đường XYZ, Quận 2, TP.HCM",
            status_text: "Chờ xử lý",
            payment_method: "Chuyển khoản ngân hàng",
        },
    ],
    order_details: [
        {
            id: 1,
            amount: 1,
            unit_price: 34990000,
            order_id: 1,
            pro_de_id: 1,
            product_name: "iPhone 15 Pro Max",
            config_name: "256GB - Titan Tự Nhiên",
            quantity: 1,
            price: 34990000,
            product_detail_id: 1,
        },
        {
            id: 2,
            amount: 1,
            unit_price: 89990000,
            order_id: 2,
            pro_de_id: 3,
            product_name: "MacBook Pro 16",
            config_name: "32GB RAM - 1TB SSD",
            quantity: 1,
            price: 89990000,
            product_detail_id: 3,
        },
    ],
    customers: [
        {
            id: 1,
            name: "Nguyễn Văn A",
            mail: "nguyenvana@email.com",
            address: "123 Đường ABC, Quận 1, TP.HCM",
            phone_number: "0901234567",
            total_spent: 34990000,
            orders_count: 1,
        },
        {
            id: 2,
            name: "Trần Thị B",
            mail: "tranthib@email.com",
            address: "456 Đường XYZ, Quận 2, TP.HCM",
            phone_number: "0907654321",
            total_spent: 89990000,
            orders_count: 1,
        },
    ],
    admins: [
        {
            id: 1,
            name: "Admin Chính",
            mail: "admin@store.com",
            address: "789 Đường Admin, Quận 3, TP.HCM",
            phone_number: "0909999999",
            role: "admin",
        },
        {
            id: 2,
            name: "Nhân Viên 1",
            mail: "nhanvien1@store.com",
            address: "321 Đường Staff, Quận 4, TP.HCM",
            phone_number: "0908888888",
            role: "employee",
        },
    ],
    payment_methods: [
        { id: 1, name: "Thanh toán khi nhận hàng" },
        { id: 2, name: "Chuyển khoản ngân hàng" },
    ],
    product_images: [
        { id: 1, product_id: 1, image_url: "/iphone-15-pro-1.jpg", is_main: true, order: 1 },
        { id: 2, product_id: 1, image_url: "/iphone-15-pro-2.jpg", is_main: false, order: 2 },
        { id: 3, product_id: 1, image_url: "/iphone-15-pro-3.jpg", is_main: false, order: 3 },
        { id: 4, product_id: 2, image_url: "/macbook.jpg", is_main: true, order: 1 },
    ],
}

const statusMap = {
    1: { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800" },
    2: { label: "Đang giao", color: "bg-blue-100 text-blue-800" },
    3: { label: "Hoàn thành", color: "bg-green-100 text-green-800" },
    4: { label: "Đã hủy", color: "bg-red-100 text-red-800" },
}

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

export function AdminDashboard({ onLogout }: { onLogout: () => void }) {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    // 🔹 Đọc tab từ URL nếu có
    const defaultTab = searchParams.get("tab") || "overview"
    const [activeTab, setActiveTab] = useState(defaultTab)

    const [selectedItem, setSelectedItem] = useState<any>(null)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [uploadedImages, setUploadedImages] = useState<string[]>([])
    const [selectedConfigs, setSelectedConfigs] = useState<number[]>([])
    const [isImportModalOpen, setIsImportModalOpen] = useState(false)

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId)
        navigate(`?tab=${tabId}`, { replace: true }) // cập nhật URL mà không reload
        setIsViewModalOpen(false)
        setIsEditModalOpen(false)
        setIsAddModalOpen(false)
        setIsDeleteDialogOpen(false)
        setIsImportModalOpen(false)
        setSelectedItem(null)
    }

    // 🔹 Khi người dùng reload (F5), URL vẫn chứa tab => khôi phục lại
    useEffect(() => {
        const urlTab = searchParams.get("tab")
        if (urlTab && urlTab !== activeTab) {
            setActiveTab(urlTab)
        }
    }, [searchParams])

    const handleAddImage = () => {
        const newImage = `/placeholder.svg?height=200&width=200&query=product-image-${uploadedImages.length + 1}`
        setUploadedImages([...uploadedImages, newImage])
    }

    const handleRemoveImage = (index: number) => {
        setUploadedImages(uploadedImages.filter((_, i) => i !== index))
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
                            handleAddImage={handleAddImage}
                            handleRemoveImage={handleRemoveImage}
                            selectedConfigs={selectedConfigs}
                            setSelectedConfigs={setSelectedConfigs}
                            isImportModalOpen={isImportModalOpen}
                            setIsImportModalOpen={setIsImportModalOpen}
                        />
                    )}
                    {activeTab === "orders" && (
                        <OrdersTab
                            selectedItem={selectedItem}
                            setSelectedItem={setSelectedItem}
                            isViewModalOpen={isViewModalOpen}
                            setIsViewModalOpen={setIsViewModalOpen}
                            isEditModalOpen={isEditModalOpen}
                            setIsEditModalOpen={setIsEditModalOpen}
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

function OverviewTab() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Tổng quan</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    {
                        title: "Tổng doanh thu",
                        value: "₫124,980,000",
                        change: "+12.5%",
                        icon: DollarSign,
                        color: "from-green-500 to-emerald-500",
                    },
                    {
                        title: "Đơn hàng",
                        value: "2",
                        change: "+8.2%",
                        icon: ShoppingBag,
                        color: "from-blue-500 to-cyan-500",
                    },
                    {
                        title: "Sản phẩm",
                        value: "2",
                        change: "+3.1%",
                        icon: Package,
                        color: "from-orange-500 to-red-500",
                    },
                    {
                        title: "Khách hàng",
                        value: "2",
                        change: "+15.3%",
                        icon: UserCheck,
                        color: "from-purple-500 to-pink-500",
                    },
                ].map((stat, index) => (
                    <Card key={index} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                    <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                                        <TrendingUp className="h-3 w-3" />
                                        {stat.change}
                                    </p>
                                </div>
                                <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                                    <stat.icon className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
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
                                        <Badge
                                            className={
                                                statusMap[order.status as keyof typeof statusMap]?.color || "bg-gray-100 text-gray-800"
                                            }
                                        >
                                            {statusMap[order.status as keyof typeof statusMap]?.label || "Không xác định"}
                                        </Badge>
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

function ProductsTab({
    selectedItem,
    setSelectedItem,
    isViewModalOpen,
    setIsViewModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    isAddModalOpen,
    setIsAddModalOpen,
    uploadedImages,
    setUploadedImages,
    handleAddImage,
    handleRemoveImage,
    selectedConfigs,
    setSelectedConfigs,
    isImportModalOpen,
    setIsImportModalOpen,
}: any) {
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const filteredProducts = mockData.products.filter(
        (product) =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.category.toLowerCase().includes(searchQuery.toLowerCase()),
    )

    const totalPages = Math.ceil(filteredProducts.length / rowsPerPage)
    const startIndex = (currentPage - 1) * rowsPerPage
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + rowsPerPage)

    const handleExportExcel = () => {
        console.log("[v0] Exporting products to Excel...")
        alert("Xuất Excel thành công! (Chức năng demo)")
    }

    const handleDownloadTemplate = () => {
        console.log("[v0] Downloading Excel template...")
        alert("Tải xuống file mẫu thành công! (Chức năng demo)")
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Tìm kiếm sản phẩm..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 border-gray-200"
                    />
                </div>
                <div className="flex gap-2">
                    <Button
                        onClick={handleExportExcel}
                        variant="outline"
                        className="border-green-500 text-green-600 hover:bg-green-50 bg-transparent"
                    >
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        Export Excel
                    </Button>
                    <Button
                        onClick={() => setIsImportModalOpen(true)}
                        variant="outline"
                        className="border-orange-500 text-orange-600 hover:bg-orange-50 bg-transparent"
                    >
                        <FileUp className="h-4 w-4 mr-2" />
                        Import Excel
                    </Button>
                    <Button
                        onClick={() => {
                            setIsAddModalOpen(true)
                            setUploadedImages([])
                            setSelectedConfigs([])
                        }}
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm sản phẩm
                    </Button>
                </div>
            </div>

            <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-b border-gray-200 bg-white">
                                <TableHead className="font-semibold text-gray-900">ID</TableHead>
                                <TableHead className="font-semibold text-gray-900">Hình ảnh</TableHead>
                                <TableHead className="font-semibold text-gray-900">Tên sản phẩm</TableHead>
                                <TableHead className="font-semibold text-gray-900">Thương hiệu</TableHead>
                                <TableHead className="font-semibold text-gray-900">Danh mục</TableHead>
                                <TableHead className="font-semibold text-gray-900">Số lượng</TableHead>
                                <TableHead className="font-semibold text-gray-900">Ngày tạo</TableHead>
                                <TableHead className="font-semibold text-gray-900 text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedProducts.map((product) => (
                                <TableRow key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <TableCell className="font-medium text-gray-900 py-4">#{product.id}</TableCell>
                                    <TableCell className="py-4">
                                        <Image
                                            src={product.image || "/placeholder.svg?height=40&width=40"}
                                            alt={product.name}
                                            width={40}
                                            height={40}
                                            className="h-10 w-10 rounded object-cover"
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium text-gray-900 py-4">{product.name}</TableCell>
                                    <TableCell className="text-gray-700 py-4">{product.brand}</TableCell>
                                    <TableCell className="text-gray-700 py-4">{product.category}</TableCell>
                                    <TableCell className="text-gray-700 py-4">{product.stock}</TableCell>
                                    <TableCell className="text-gray-700 py-4">{product.created_at}</TableCell>
                                    <TableCell className="text-right py-4">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedItem(product)
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
                                                    setSelectedItem(product)
                                                    setIsEditModalOpen(true)
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
                rowsPerPage={rowsPerPage}
                totalItems={filteredProducts.length}
                onPageChange={setCurrentPage}
                onRowsPerPageChange={setRowsPerPage}
            />

            {/* View Product Dialog */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Chi tiết sản phẩm</DialogTitle>
                    </DialogHeader>
                    {selectedItem && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Tên sản phẩm</Label>
                                    <p className="mt-1 text-gray-900">{selectedItem.name}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Thương hiệu</Label>
                                    <p className="mt-1 text-gray-900">{selectedItem.brand}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Danh mục</Label>
                                    <p className="mt-1 text-gray-900">{selectedItem.category}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Giá</Label>
                                    <p className="mt-1 text-gray-900">{selectedItem.price?.toLocaleString()} đ</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Số lượng</Label>
                                    <p className="mt-1 text-gray-900">{selectedItem.stock}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Ngày tạo</Label>
                                    <p className="mt-1 text-gray-900">{selectedItem.created_at}</p>
                                </div>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-700">Mô tả</Label>
                                <p className="mt-1 text-gray-900">{selectedItem.description || "Không có mô tả"}</p>
                            </div>
                            {selectedItem.image && (
                                <div>
                                    <Label className="text-sm font-medium text-gray-700">Hình ảnh</Label>
                                    <Image
                                        src={selectedItem.image || "/placeholder.svg"}
                                        fill
                                        alt={selectedItem.name}
                                        className="mt-2 w-48 h-48 object-cover rounded-lg border"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Add Product Dialog */}
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Thêm sản phẩm mới</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="name">Tên sản phẩm</Label>
                                <Input id="name" placeholder="Nhập tên sản phẩm" />
                            </div>
                            <div>
                                <Label htmlFor="brand">Thương hiệu</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn thương hiệu" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mockData.brands.map((brand) => (
                                            <SelectItem key={brand.id} value={brand.id.toString()}>
                                                {brand.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="category">Danh mục</Label>
                                <Select>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chọn danh mục" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {mockData.categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="stock">Số lượng</Label>
                                <Input id="stock" type="number" placeholder="Nhập số lượng" />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="description">Mô tả</Label>
                            <Textarea id="description" placeholder="Nhập mô tả sản phẩm" rows={4} />
                        </div>
                        <div>
                            <Label>Hình ảnh (có thể chọn nhiều)</Label>
                            <div className="mt-2 space-y-2">
                                {uploadedImages.length > 0 && (
                                    <div className="grid grid-cols-4 gap-2">
                                        {uploadedImages.map((img, index) => (
                                            <div key={index} className="relative group">
                                                <Image
                                                    src={img || "/placeholder.svg"}
                                                    fill
                                                    alt={`Product ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded-lg border"
                                                />
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => setUploadedImages(uploadedImages.filter((_, i) => i !== index))}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                                    <div className="flex items-center justify-center">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                // Simulate image upload
                                                setUploadedImages([...uploadedImages, "/placeholder.svg?height=100&width=100"])
                                            }}
                                        >
                                            <Upload className="h-4 w-4 mr-2" />
                                            Tải lên hình ảnh
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <Label>Cấu hình sản phẩm (có thể chọn nhiều)</Label>
                            <div className="mt-2 border rounded-lg p-4 space-y-2">
                                {mockData.configurations.map((config) => (
                                    <div
                                        key={config.id}
                                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Checkbox
                                                id={`config-${config.id}`}
                                                checked={selectedConfigs.includes(config.id)}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        setSelectedConfigs([...selectedConfigs, config.id])
                                                    } else {
                                                        setSelectedConfigs(selectedConfigs.filter((id) => id !== config.id))
                                                    }
                                                }}
                                            />
                                            <Label htmlFor={`config-${config.id}`} className="cursor-pointer font-normal">
                                                {config.name}
                                            </Label>
                                        </div>
                                        <span className="text-orange-600 font-semibold">₫{config.price.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-gray-500 mt-2">Chọn các cấu hình có sẵn cho sản phẩm này</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                            onClick={() => {
                                // Reset form
                                setUploadedImages([])
                                setSelectedConfigs([])
                                setIsAddModalOpen(false)
                            }}
                        >
                            Thêm sản phẩm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Product Dialog */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
                    </DialogHeader>
                    {selectedItem && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="edit-name">Tên sản phẩm</Label>
                                    <Input id="edit-name" defaultValue={selectedItem.name} />
                                </div>
                                <div>
                                    <Label htmlFor="edit-brand">Thương hiệu</Label>
                                    <Select defaultValue={selectedItem.brand_id?.toString()}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn thương hiệu" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mockData.brands.map((brand) => (
                                                <SelectItem key={brand.id} value={brand.id.toString()}>
                                                    {brand.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="edit-category">Danh mục</Label>
                                    <Select defaultValue={selectedItem.cat_id?.toString()}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Chọn danh mục" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {mockData.categories.map((category) => (
                                                <SelectItem key={category.id} value={category.id.toString()}>
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <Label htmlFor="edit-stock">Số lượng</Label>
                                    <Input id="edit-stock" type="number" defaultValue={selectedItem.stock} />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="edit-description">Mô tả</Label>
                                <Textarea id="edit-description" defaultValue={selectedItem.description} rows={4} />
                            </div>
                            <div>
                                <Label>Hình ảnh hiện tại (có thể chọn nhiều)</Label>
                                {selectedItem.images && selectedItem.images.length > 0 && (
                                    <div className="mt-2 grid grid-cols-4 gap-2">
                                        {selectedItem.images.map((img: string, index: number) => (
                                            <div key={index} className="relative group">
                                                <Image
                                                    src={img || "/placeholder.svg"}
                                                    fill
                                                    alt={`${selectedItem.name} ${index + 1}`}
                                                    className="w-full h-24 object-cover rounded-lg border"
                                                />
                                                <Button
                                                    variant="destructive"
                                                    size="icon"
                                                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4">
                                    <div className="flex items-center justify-center">
                                        <Button variant="outline" size="sm">
                                            <Upload className="h-4 w-4 mr-2" />
                                            Thêm hình ảnh
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <Label>Cấu hình sản phẩm (có thể chọn nhiều)</Label>
                                <div className="mt-2 border rounded-lg p-4 space-y-2">
                                    {mockData.configurations
                                        .filter((config) => config.product_id === selectedItem.id)
                                        .map((config) => (
                                            <div
                                                key={config.id}
                                                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Checkbox id={`edit-config-${config.id}`} defaultChecked />
                                                    <Label htmlFor={`edit-config-${config.id}`} className="cursor-pointer font-normal">
                                                        {config.name}
                                                    </Label>
                                                </div>
                                                <span className="text-orange-600 font-semibold">₫{config.price.toLocaleString()}</span>
                                            </div>
                                        ))}
                                </div>
                                <p className="text-sm text-gray-500 mt-2">Chọn các cấu hình có sẵn cho sản phẩm này</p>
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                        >
                            Lưu thay đổi
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isImportModalOpen} onOpenChange={setIsImportModalOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <FileUp className="h-5 w-5 text-orange-500" />
                            Import sản phẩm từ Excel
                        </DialogTitle>
                        <DialogDescription>Tải lên file Excel chứa danh sách sản phẩm</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-500 hover:bg-orange-50 transition-colors cursor-pointer">
                            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-sm text-gray-600 mb-1">Kéo thả file Excel vào đây</p>
                            <p className="text-xs text-gray-500">hoặc click để chọn file</p>
                            <input type="file" accept=".xlsx,.xls" className="hidden" />
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <Download className="h-4 w-4 text-gray-600" />
                            <button onClick={handleDownloadTemplate} className="text-orange-600 hover:underline font-medium">
                                Tải xuống file mẫu
                            </button>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsImportModalOpen(false)}>
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                        >
                            Import
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function ImagesTab({ selectedItem, setSelectedItem, isEditModalOpen, setIsEditModalOpen }: any) {
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [searchQuery, setSearchQuery] = useState("")

    const filteredImages = mockData.product_images.filter((img) => {
        const product = mockData.products.find((p) => p.id === img.product_id)
        return product?.name.toLowerCase().includes(searchQuery.toLowerCase())
    })

    const totalPages = Math.ceil(filteredImages.length / rowsPerPage)
    const startIndex = (currentPage - 1) * rowsPerPage
    const paginatedImages = filteredImages.slice(startIndex, startIndex + rowsPerPage)

    const handleEdit = (image: any) => {
        setSelectedItem(image)
        setIsEditModalOpen(true)
    }

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
                                <TableHead>Thứ tự</TableHead>
                                <TableHead>Ảnh chính</TableHead>
                                <TableHead>Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedImages.map((img) => {
                                const product = mockData.products.find((p) => p.id === img.product_id)
                                return (
                                    <TableRow key={img.id}>
                                        <TableCell>
                                            <Image
                                                src={img.image_url || "/placeholder.svg"}
                                                alt="Product"
                                                width={400}
                                                height={400}
                                                className="w-16 h-16 rounded-lg object-cover"
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium text-gray-900">{product?.name || "N/A"}</TableCell>
                                        <TableCell className="text-gray-600">{img.order}</TableCell>
                                        <TableCell>
                                            {img.is_main ? (
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
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEdit(img)}
                                                    className="hover:bg-orange-50 text-orange-600"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" className="hover:bg-red-50 text-red-600">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
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
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
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
                                    width={400}
                                    height={400}
                                    alt="Product"
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
            const response = await axios.get("https://technology-backend-5hxg.onrender.com/api/roles", {
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
            const response = await axios.get("https://technology-backend-5hxg.onrender.com/api/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            })

            const users = (response.data.data || response.data) as any[]
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
                await axios.post("https://technology-backend-5hxg.onrender.com/api/users", formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success("Thêm nhân viên thành công 🎉");
            } else if (isEditModalOpen) {
                await axios.patch(
                    `https://technology-backend-5hxg.onrender.com/api/users/${selectedItem.id}`,
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
            await axios.delete(`https://technology-backend-5hxg.onrender.com/api/users/${id}`, {
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
                                    {selectedItem.role === "admin" ? (
                                        <>
                                            <p className="text-gray-600">✓ Toàn quyền quản lý hệ thống</p>
                                            <p className="text-gray-600">✓ Quản lý nhân viên</p>
                                            <p className="text-gray-600">✓ Xem và chỉnh sửa tất cả dữ liệu</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-gray-600">✓ Quản lý sản phẩm</p>
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

// ... existing code for CustomersTab and InventoryTab with search functionality added ...

function CustomersTab({
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

    const filteredCustomers = mockData.customers.filter(
        (customer) =>
            customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.mail.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.phone_number.includes(searchQuery),
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
                <h2 className="text-2xl font-bold text-gray-900">Quản lý khách hàng</h2>
                <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm khách hàng
                </Button>
            </div>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-5 w-5 text-orange-500" />
                            Danh sách khách hàng
                        </CardTitle>
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Tìm kiếm khách hàng..."
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
                                <TableHead>Tên khách hàng</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Số điện thoại</TableHead>
                                <TableHead>Tổng chi tiêu</TableHead>
                                <TableHead>Đơn hàng</TableHead>
                                <TableHead>Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedCustomers.map((customer) => (
                                <TableRow key={customer.id}>
                                    <TableCell className="font-medium text-gray-900">{customer.name}</TableCell>
                                    <TableCell className="text-gray-600">{customer.mail}</TableCell>
                                    <TableCell className="text-gray-600">{customer.phone_number}</TableCell>
                                    <TableCell className="font-bold text-gray-900">
                                        ₫{customer.total_spent?.toLocaleString() || "0"}
                                    </TableCell>
                                    <TableCell className="text-gray-600">{customer.orders_count} đơn</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleView(customer)}
                                                className="hover:bg-blue-50 text-blue-600"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleEdit(customer)}
                                                className="hover:bg-orange-50 text-orange-600"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="hover:bg-red-50 text-red-600">
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
                        totalItems={filteredCustomers.length}
                    />
                </CardContent>
            </Card>
            {/* View Customer Modal */}
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
                                            <p className="text-gray-900 font-medium">{selectedItem.name}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                            <span className="text-gray-900">{selectedItem.mail}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-gray-400" />
                                            <span className="text-gray-900">{selectedItem.phone_number}</span>
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
                                            <div className="text-2xl font-bold text-blue-600">{selectedItem.orders_count}</div>
                                            <div className="text-sm text-blue-600">Tổng đơn hàng</div>
                                        </div>
                                        <div className="bg-green-50 p-3 rounded-lg">
                                            <div className="text-2xl font-bold text-green-600">
                                                ₫{selectedItem.total_spent?.toLocaleString() || "0"}
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

            {/* Add/Edit Customer Modal */}
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

function InventoryTab({
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
            <h2 className="text-2xl font-bold text-gray-900">Quản lý kho hàng</h2>

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
            const response = await axios.get("https://technology-backend-5hxg.onrender.com/api/categories", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            })
            const data = response.data.data || response.data

            // 🔹 Sắp xếp theo id giảm dần
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
                    "https://technology-backend-5hxg.onrender.com/api/categories/create",
                    { name },
                    { headers: { Authorization: `Bearer ${token}` } }
                )
            } else if (isEditModalOpen && selectedItem) {
                await axios.patch(
                    `https://technology-backend-5hxg.onrender.com/api/categories/update/${selectedItem.id}`,
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
            await axios.delete(`https://technology-backend-5hxg.onrender.com/api/categories/delete/${id}`, {
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

    // 🔸 Lấy token từ localStorage
    // const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

    // 🔹 Hàm lấy dữ liệu thương hiệu từ API
    const fetchBrands = async () => {
        if (!token) return
        try {
            const response = await axios.get("https://technology-backend-5hxg.onrender.com/api/brands", {
                headers: { Authorization: `Bearer ${token}` },
            })
            const data = response.data.data || response.data

            // 🔹 Sắp xếp theo id giảm dần
            const sortedBrands = data.sort((a: any, b: any) => b.id - a.id)

            setBrands(sortedBrands)
        } catch (err) {
            console.error("Error fetching brands:", err)
        }
    }

    // 🔹 Gọi khi component mount
    useEffect(() => {
        fetchBrands()
    }, [token])

    const filteredBrands = brands.filter((brand) => brand.name.toLowerCase().includes(searchQuery.toLowerCase()))

    const totalPages = Math.ceil(filteredBrands.length / rowsPerPage)
    const startIndex = (currentPage - 1) * rowsPerPage
    const paginatedBrands = filteredBrands.slice(startIndex, startIndex + rowsPerPage)

    // 🔹 Hàm thêm hoặc cập nhật thương hiệu
    const handleSave = async (name: string) => {
        try {
            if (isAddModalOpen) {
                await axios.post(
                    "https://technology-backend-5hxg.onrender.com/api/brands",
                    { name },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                )
            } else if (isEditModalOpen && selectedItem) {
                await axios.patch(
                    `https://technology-backend-5hxg.onrender.com/api/brands/${selectedItem.id}`,
                    { name },
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                )
            }
            await fetchBrands() // ✅ gọi lại để cập nhật danh sách

            // 🔹 Đóng modal và reset
            setIsAddModalOpen(false)
            setIsEditModalOpen(false)
            setSelectedItem(null)
        } catch (err) {
            console.error("Error saving brand:", err)
        }
    }

    // 🔹 Hàm xoá thương hiệu
    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`https://technology-backend-5hxg.onrender.com/api/brands/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            setBrands(brands.filter((brand) => brand.id !== id))
        } catch (err) {
            console.error("Error deleting brand:", err)
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
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm thương hiệu
                </Button>
            </div>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="pt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tên thương hiệu</TableHead>
                                <TableHead>Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedBrands.length > 0 ? (
                                paginatedBrands.map((brand) => (
                                    <TableRow key={brand.id}>
                                        <TableCell className="font-medium text-gray-900">{brand.name}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedItem(brand)
                                                        setIsEditModalOpen(true)
                                                    }}
                                                    className="hover:bg-orange-50 text-orange-600"
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="sm" className="hover:bg-red-50 text-red-600" onClick={() => handleDelete(brand.id)}>
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
                        onRowsPerPageChange={setRowsPerPage}
                        totalItems={filteredBrands.length}
                    />
                </CardContent>
            </Card>

            {/* Add/Edit Brand Modal */}
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
                            {isAddModalOpen ? "Thêm thương hiệu mới" : "Chỉnh sửa thương hiệu"}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div>
                            <Label htmlFor="brand-name">Tên thương hiệu</Label>
                            <Input
                                id="brand-name"
                                placeholder="Nhập tên thương hiệu"
                                defaultValue={selectedItem?.name || ""}
                                onChange={(e) => setSelectedItem((prev: any) => ({ ...prev, name: e.target.value }))}
                                className="border-gray-200"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600" onClick={() => handleSave(selectedItem?.name || "")}>
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

function OrdersTab({
    selectedItem,
    setSelectedItem,
    isViewModalOpen,
    setIsViewModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
}: any) {
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [statusFilter, setStatusFilter] = useState("all")
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [selectedOrders, setSelectedOrders] = useState<number[]>([])
    const [editingStatusId, setEditingStatusId] = useState<number | null>(null)
    const [tempStatus, setTempStatus] = useState<string>("")

    const filteredOrders = mockData.orders.filter((order) => {
        const matchesSearch =
            order.id.toString().includes(searchQuery) || order.customer_name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesStatus = statusFilter === "all" || order.status_text === statusFilter // Use status_text for filtering
        return matchesSearch && matchesStatus
    })

    const totalPages = Math.ceil(filteredOrders.length / rowsPerPage)
    const startIndex = (currentPage - 1) * rowsPerPage
    const paginatedOrders = filteredOrders.slice(startIndex, startIndex + rowsPerPage)

    const getStatusColor = (status: string) => {
        switch (status) {
            case "Hoàn thành":
                return "bg-green-100 text-green-700"
            case "Chờ xử lý":
                return "bg-yellow-100 text-yellow-700"
            case "Đã hủy":
                return "bg-red-100 text-red-700"
            case "Đang giao":
                return "bg-blue-100 text-blue-700"
            default:
                return "bg-gray-100 text-gray-700"
        }
    }

    const handleStatusClick = (orderId: number, currentStatus: string) => {
        setEditingStatusId(orderId)
        setTempStatus(currentStatus)
    }

    const handleStatusUpdate = (orderId: number) => {
        console.log(`[v0] Updating order ${orderId} status to: ${tempStatus}`)
        // In a real implementation, this would update the order status in the database
        const order = mockData.orders.find((o) => o.id === orderId)
        if (order) {
            order.status_text = tempStatus
        }
        setEditingStatusId(null)
        alert(`Đã cập nhật trạng thái đơn hàng #${orderId}`)
    }

    const handleStatusCancel = () => {
        setEditingStatusId(null)
        setTempStatus("")
    }

    const handleOrderSelect = (orderId: number) => {
        if (selectedOrders.includes(orderId)) {
            setSelectedOrders(selectedOrders.filter((id) => id !== orderId))
        } else {
            setSelectedOrders([...selectedOrders, orderId])
        }
    }

    const handleSelectAll = () => {
        if (selectedOrders.length === paginatedOrders.length) {
            setSelectedOrders([])
        } else {
            setSelectedOrders(paginatedOrders.map((order) => order.id))
        }
    }

    const handleExportPDF = () => {
        if (selectedOrders.length === 0) {
            alert("Vui lòng chọn ít nhất một đơn hàng để xuất PDF")
            return
        }
        console.log("[v0] Exporting orders to PDF:", selectedOrders)
        // In a real implementation, this would generate and download a PDF file
        alert(`Xuất ${selectedOrders.length} đơn hàng ra PDF thành công! (Chức năng demo)`)
        setSelectedOrders([])
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="Tìm kiếm đơn hàng..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 border-gray-200"
                    />
                </div>
                <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-48 border-gray-200">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Lọc theo trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả trạng thái</SelectItem>
                            <SelectItem value="Chờ xử lý">Chờ xử lý</SelectItem>
                            <SelectItem value="Đang giao">Đang giao</SelectItem>
                            <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
                            <SelectItem value="Đã hủy">Đã hủy</SelectItem>
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
                                        checked={selectedOrders.length === paginatedOrders.length && paginatedOrders.length > 0}
                                        onCheckedChange={handleSelectAll}
                                    />
                                </TableHead>
                                <TableHead className="font-semibold text-gray-900">ID</TableHead>
                                <TableHead className="font-semibold text-gray-900">Khách hàng</TableHead>
                                <TableHead className="font-semibold text-gray-900">Ngày đặt</TableHead>
                                <TableHead className="font-semibold text-gray-900">Tổng tiền</TableHead>
                                <TableHead className="font-semibold text-gray-900">Trạng thái</TableHead>
                                <TableHead className="font-semibold text-gray-900 text-right">Thao tác</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedOrders.map((order) => (
                                <TableRow key={order.id} className="border-b border-gray-100 hover:bg-gray-50">
                                    <TableCell className="py-4">
                                        <Checkbox
                                            checked={selectedOrders.includes(order.id)}
                                            onCheckedChange={() => handleOrderSelect(order.id)}
                                        />
                                    </TableCell>
                                    <TableCell className="font-medium text-gray-900 py-4">#{order.id}</TableCell>
                                    <TableCell className="font-medium text-gray-900 py-4">{order.customer_name}</TableCell>
                                    <TableCell className="text-gray-700 py-4">{order.order_date}</TableCell>
                                    <TableCell className="font-semibold text-orange-600 py-4">
                                        đ{order.total?.toLocaleString() || "0"}
                                    </TableCell>
                                    <TableCell className="py-4">
                                        {editingStatusId === order.id ? (
                                            <div className="flex items-center gap-2">
                                                <Select value={tempStatus} onValueChange={setTempStatus}>
                                                    <SelectTrigger className="w-32 h-8">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Chờ xử lý">Chờ xử lý</SelectItem>
                                                        <SelectItem value="Đang giao">Đang giao</SelectItem>
                                                        <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
                                                        <SelectItem value="Đã hủy">Đã hủy</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => handleStatusUpdate(order.id)}
                                                    className="h-8 w-8 p-0 text-green-600 hover:bg-green-50"
                                                >
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={handleStatusCancel}
                                                    className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleStatusClick(order.id, order.status_text)}
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status_text)} cursor-pointer hover:opacity-80 transition-opacity`}
                                            >
                                                {order.status_text}
                                            </button>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right py-4">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedItem(order)
                                                    setIsViewModalOpen(true)
                                                }}
                                                className="hover:bg-blue-50"
                                            >
                                                <Eye className="h-4 w-4 text-blue-500" />
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
                rowsPerPage={rowsPerPage}
                totalItems={filteredOrders.length}
                onPageChange={setCurrentPage}
                onRowsPerPageChange={setRowsPerPage}
            />

            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <ShoppingCart className="h-5 w-5 text-blue-500" />
                            Chi tiết đơn hàng #{selectedItem?.id}
                        </DialogTitle>
                    </DialogHeader>
                    {selectedItem && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-gray-900">Thông tin khách hàng</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <UserCheck className="h-4 w-4 text-gray-400" />
                                            <span className="text-gray-600">Tên:</span>
                                            <span className="font-medium text-gray-900">{selectedItem.customer_name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-gray-400" />
                                            <span className="text-gray-600">SĐT:</span>
                                            <span className="font-medium text-gray-900">{selectedItem.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                            <span className="text-gray-600">Email:</span>
                                            <span className="font-medium text-gray-900">{selectedItem.email}</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                            <span className="text-gray-600">Địa chỉ:</span>
                                            <span className="font-medium text-gray-900 flex-1">{selectedItem.address}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-gray-900">Thông tin đơn hàng</h4>
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <span className="text-gray-600">Ngày đặt:</span>
                                            <p className="font-medium text-gray-900">{selectedItem.order_date}</p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Trạng thái:</span>
                                            <p>
                                                <span
                                                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(
                                                        selectedItem.status_text,
                                                    )}`}
                                                >
                                                    {selectedItem.status_text}
                                                </span>
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-gray-600">Phương thức thanh toán:</span>
                                            <p className="font-medium text-gray-900">{selectedItem.payment_method}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <h4 className="font-semibold text-gray-900 mb-3">Chi tiết sản phẩm trong đơn hàng</h4>
                                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                                    {mockData.order_details
                                        .filter((od) => od.order_id === selectedItem.id)
                                        .map((od) => {
                                            const productDetail = mockData.product_details.find((pd) => pd.id === od.product_detail_id)
                                            const product = mockData.products.find((p) => p.id === productDetail?.product_id)
                                            const config = mockData.configurations.find((c) => c.id === productDetail?.config_id)

                                            return (
                                                <div key={od.id} className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg">
                                                    <Image
                                                        src={product?.img || "/placeholder.svg"}
                                                        alt={product?.name}
                                                        width={400}
                                                        height={400}
                                                        className="w-16 h-16 rounded object-cover"
                                                    />
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-900">{product?.name}</p>
                                                        <p className="text-sm text-gray-600">{config?.name}</p>
                                                        <p className="text-xs text-gray-500">Số lượng: {od.quantity}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold text-orange-600">₫{od.price?.toLocaleString() || "0"}</p>
                                                        <p className="text-xs text-gray-500">
                                                            Tổng: ₫{((od.price || 0) * (od.quantity || 0)).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                </div>
                                {mockData.order_details.filter((od) => od.order_id === selectedItem.id).length > 5 && (
                                    <p className="text-xs text-gray-500 mt-2 text-center">Cuộn để xem thêm sản phẩm</p>
                                )}
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-900">Tổng cộng:</span>
                                    <span className="text-2xl font-bold text-orange-600">
                                        ₫{selectedItem.total?.toLocaleString() || "0"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
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
