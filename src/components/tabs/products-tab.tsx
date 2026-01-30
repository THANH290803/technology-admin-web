"use client"

import { useState, useRef, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import axios from "axios"
import Swal from "sweetalert2"
import Image from "next/image"
import { Search, Eye, Edit, Trash2, Plus, Upload, X, FileSpreadsheet, FileUp, Download } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Pagination } from "@/components/pagination"
import { mockData } from "@/lib/mock-data"
import Link from "next/link"
import { toast } from "react-hot-toast"

interface Configuration {
  id: number
  name: string
}


export function ProductsTab({
  selectedItem,
  setSelectedItem,
  isViewModalOpen,
  setIsViewModalOpen,
  isEditModalOpen,
  setIsEditModalOpen,
  isAddModalOpen,
  // handleConfigQuantityChange,
  // configQuantities,
  // setConfigQuantities,
  // configPrices,
  setIsAddModalOpen,
  // selectedConfigs,
  // setSelectedConfigs,
  isImportModalOpen,
  setIsImportModalOpen,
  // setConfigPrices,
  // handleConfigPriceChange
}: any) {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [products, setProducts] = useState<any[]>([])
  // images will be array of { productId, imageUrl }
  const [images, setImages] = useState<{ productId: number; imageUrl: string }[]>(
    []
  )
  const [mergedProducts, setMergedProducts] = useState<any[]>([])
  const [name, setName] = useState("")
  const [brandId, setBrandId] = useState<number | null>(null);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [description, setDescription] = useState("")
  const categorySelectRef = useRef<HTMLDivElement>(null);

  interface Props {
    isEditModalOpen: boolean;
    setIsEditModalOpen: (open: boolean) => void;
    selectedItem: any;
    token: string;
    brands: any[];
    categories: any[];
    configurations: any[];
    handleUpdateProduct: () => void;
  }

  // base URL for image-by-product endpoint (you gave this url)

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null

  // Fetch products and return list (so caller can chain)
  const fetchProducts = async (): Promise<any[]> => {
    if (!token) return []
    try {
      const res = await axios.get("http://localhost:8080/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = res.data.data || res.data
      let list = Array.isArray(data) ? data : []

      // Sắp xếp id giảm dần
      list = list.sort((a, b) => b.id - a.id)

      setProducts(list)
      return list
    } catch (error) {
      console.error("❌ Lỗi khi tải sản phẩm:", error)
      setProducts([])
      return []
    }
  }

  // Fetch main image for a single productId via your endpoint
  const fetchMainImageForProduct = async (productId: number) => {
    if (!token) return { productId, imageUrl: "/placeholder.svg" }
    try {
      const res = await axios.get(`http://localhost:8080/api/images/product/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = res.data.data || res.data
      // data might be an array or single object
      let mainImage: any = null
      if (Array.isArray(data)) {
        mainImage = data.find((img: any) => img.isMain) || data[0] || null
      } else if (data && typeof data === "object") {
        // if endpoint returns a single image object
        mainImage = data.isMain ? data : data
      }
      return {
        productId,
        imageUrl: mainImage?.imageUrl || "/placeholder.svg",
      }
    } catch (error) {
      console.error(`❌ Lỗi khi tải ảnh cho productId=${productId}:`, error)
      return { productId, imageUrl: "/placeholder.svg" }
    }
  }

  // Fetch main images for all products (in parallel)
  const fetchMainImages = async (productsList: any[]) => {
    if (!token || !productsList || productsList.length === 0) {
      setImages([])
      return
    }
    try {
      const promises = productsList.map((p) =>
        fetchMainImageForProduct(Number(p.id))
      )
      const imagesData = await Promise.all(promises)
      setImages(imagesData)
    } catch (error) {
      console.error("❌ Lỗi khi tải ảnh chính cho sản phẩm:", error)
      setImages([])
    }
  }

  // Combine products + images into mergedProducts for UI
  useEffect(() => {
    if (products.length > 0) {
      const combined = products.map((product) => {
        const found = images.find((img) => Number(img.productId) === Number(product.id))
        return {
          ...product,
          imageUrl: found?.imageUrl || "/placeholder.svg",
        }
      })
      setMergedProducts(combined)
    } else {
      setMergedProducts([])
    }
  }, [products, images])

  // On mount (and when token changes) fetch products then images
  useEffect(() => {
    if (!token) return
    let mounted = true

    const run = async () => {
      const productsList = await fetchProducts()
      if (!mounted) return
      // fetch main images for returned products
      if (productsList.length > 0) {
        await fetchMainImages(productsList)
      } else {
        setImages([])
      }
    }
    run()

    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])


  const [brands, setBrands] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const fetchBrands = async () => {
    if (!token) return
    try {
      const res = await axios.get("http://localhost:8080/api/brands", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = res.data.data || res.data
      setBrands(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("❌ Lỗi khi tải thương hiệu:", error)
      setBrands([])
    }
  }

  const fetchCategories = async () => {
    if (!token) return
    try {
      const res = await axios.get("http://localhost:8080/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = res.data.data || res.data
      setCategories(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("❌ Lỗi khi tải danh mục:", error)
      setCategories([])
    }
  }

  useEffect(() => {
    if (!token) return
    fetchBrands()
    fetchCategories()
  }, [token])

  const [configurations, setConfigurations] = useState<any[]>([])
  const [selectedConfigs, setSelectedConfigs] = useState<number[]>([])
  const [configPrices, setConfigPrices] = useState<Record<number, number>>({})
  const [configQuantities, setConfigQuantities] = useState<Record<number, number>>({})
  const [productDetails, setProductDetails] = useState<any[]>([])


  // 👉 Fetch danh sách cấu hình
  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/configurations", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = Array.isArray(res.data) ? res.data : []
        setConfigurations(data)

        // 👉 Mặc định chọn cấu hình đầu tiên nếu chưa có
        if (data.length > 0 && selectedConfigs.length === 0) {
          const firstId = data[0].id
          setSelectedConfigs([firstId])
          setConfigPrices({ [firstId]: 0 })
          setConfigQuantities({ [firstId]: 1 })
        }
      } catch (error) {
        console.error("❌ Lỗi khi lấy cấu hình:", error)
      }
    }
    fetchConfigs()
  }, [])

  // 👉 Khi có thay đổi cấu hình / giá / số lượng thì cập nhật productDetails
  useEffect(() => {
    const details = selectedConfigs.map((id) => ({
      configuration_id: id,
      price: configPrices[id] ?? 0,
      quantity: configQuantities[id] ?? 1,
    }))
    setProductDetails(details)
  }, [selectedConfigs, configPrices, configQuantities])

  const handleCheckboxChange = (checked: boolean, config: Configuration) => {
    if (checked) {
      setSelectedConfigs((prev) => [...prev, config.id])
    } else {
      setSelectedConfigs((prev) => prev.filter((id) => id !== config.id))
      setConfigPrices((prev) => {
        const copy = { ...prev }
        delete copy[config.id]
        return copy
      })
      setConfigQuantities((prev) => {
        const copy = { ...prev }
        delete copy[config.id]
        return copy
      })
    }
  }

  const handleConfigPriceChange = (id: number, value: number) => {
    setConfigPrices((prev) => ({ ...prev, [id]: value }))
  }

  const handleConfigQuantityChange = (id: number, value: number) => {
    setConfigQuantities((prev) => ({ ...prev, [id]: value }))
  }

  // 🔹 Input file để chọn ảnh local
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  const handleAddImage = () => {
    fileInputRef.current?.click()
  }

  // Khi chọn file từ local
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const fileArray = Array.from(files)

    // ✅ Tạo URL preview
    const newPreviews = fileArray.map((file) => URL.createObjectURL(file))

    // ✅ Lưu cả ảnh cũ và ảnh mới
    setUploadedImages((prev) => [...prev, ...newPreviews])
    setSelectedFiles((prev) => [...prev, ...fileArray])
  }

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  // Gửi API
  const handleAddProduct = async () => {
    try {
      const details = selectedConfigs.map((configId) => ({
        configurationId: configId,
        quantity: configQuantities[configId] ?? 1,
        price: configPrices[configId] ?? 0,
      }))

      const payload = {
        name,
        description,
        totalQuality: Object.values(configQuantities).reduce((a, b) => a + b, 0),
        brandId: Number(brandId),
        categoryId: Number(categoryId),
        productDetails: details,
      }

      // Tạo sản phẩm
      const response = await axios.post(
        "http://localhost:8080/api/products/create-product-productDetails",
        payload,
        {
          headers:
          {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          }
        }
      )

      const newProductId = response.data.id || 0

      // Upload ảnh nếu có
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((file) => formData.append("files", file));

        await axios.post(
          `http://localhost:8080/api/images/upload?productId=${newProductId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }


      toast.success("Thêm sản phẩm thành công 🎉")
      setIsAddModalOpen(false)
      // Reset form
      setName("")
      setBrandId(null)
      setCategoryId(null)
      setDescription("")
      setSelectedConfigs([])
      setConfigPrices({})
      setConfigQuantities({})
      setUploadedImages([])
    } catch (error) {
      console.error(error)
      toast.error("Thêm sản phẩm thất bại 😢")
    }
  }

  useEffect(() => {
    if (!selectedItem) return;

    const fetchProductDetails = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/product-details/product/${selectedItem.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const details = Array.isArray(res.data) ? res.data : [res.data];
        if (!details || details.length === 0) return;

        // lấy product từ firstDetail
        const product = details[0].product;

        setName(product?.name ?? "");
        setBrandId(product?.brand?.id ?? null);
        setCategoryId(product?.category?.id ?? null);
        setDescription(product?.description ?? "");

        // load ảnh
        const images = product?.images || [];
        setUploadedImages(images.map(img => img.imageUrl ?? "/placeholder.svg"));

        // load all configurations
        const configsRes = await axios.get(
          `http://localhost:8080/api/configurations`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setConfigurations(Array.isArray(configsRes.data) ? configsRes.data : []);

        // set selectedConfigs, giá, số lượng từ productDetails
        const selectedIds: number[] = [];
        const prices: Record<number, number> = {};
        const quantities: Record<number, number> = {};

        details.forEach(detail => {
          const configId = detail.configuration?.id;
          if (configId) {
            selectedIds.push(configId);
            prices[configId] = detail.price ?? 0;
            quantities[configId] = detail.quantity ?? 1;
          }
        });

        setSelectedConfigs(selectedIds);
        setConfigPrices(prices);
        setConfigQuantities(quantities);

      } catch (err) {
        console.error("❌ Lỗi load chi tiết sản phẩm:", err);
      }
    };

    fetchProductDetails();
  }, [selectedItem, token]);

  // ---------------- SUBMIT PATCH ----------------
  const handleUpdateProduct = async () => {
    try {
      const productDetailsPayload = selectedConfigs.map((id) => ({
        configurationId: id,
        price: configPrices[id] ?? 0,
        quantity: configQuantities[id] ?? 1,
      }));

      const payload = {
        name,
        brandId,
        categoryId,
        description,
        productDetails: productDetailsPayload,
      };

      // Patch product
      await axios.patch(
        `http://localhost:8080/api/products/updateProductWithProductDetail/${selectedItem.id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } }
      );

      // Upload ảnh nếu có
      if (uploadedImages.length > 0 && fileInputRef.current?.files?.length) {
        const formData = new FormData();
        for (let i = 0; i < fileInputRef.current.files.length; i++) {
          const file = fileInputRef.current.files[i];
          if (file) formData.append("files", file);
        }
        await axios.post(
          `http://localhost:8080/api/images/upload?productId=${selectedItem.id}`,
          formData,
          { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
        );
      }

      toast.success("Cập nhật sản phẩm thành công 🎉");
      setIsEditModalOpen(false);
      fetchProducts?.(); // reload danh sách
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật sản phẩm thất bại 😢");
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn?",
      text: "Sản phẩm sẽ bị xoá khỏi hệ thống!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xoá",
      cancelButtonText: "Huỷ",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
    })

    if (!result.isConfirmed) return

    try {
      const token = localStorage.getItem("token")
      await axios.delete(`http://localhost:8080/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setProducts((prev) => prev.filter((p) => p.id !== id))
      Swal.fire("Đã xoá!", "Sản phẩm đã được xoá thành công.", "success")
    } catch (error) {
      console.error(error)
      Swal.fire("Lỗi", "Không thể xoá sản phẩm.", "error")
    }
  }

  const filteredProducts = mergedProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + rowsPerPage)

  const handleExportExcel = () => {
    alert("Xuất Excel thành công! (Chức năng demo)")
  }

  const handleDownloadTemplate = () => {
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
            onClick={() => {
              setIsImportModalOpen(true)
              setUploadedImages([])
              setSelectedConfigs([])
              setConfigQuantities({})
              setConfigPrices({})
            }}
            variant="outline"
            className="border-orange-500 text-orange-600 hover:bg-orange-50 bg-transparent"
          >
            <FileUp className="h-4 w-4 mr-2" />
            Import Excel
          </Button>
          <Button
            onClick={() => {
              setIsAddModalOpen(true)
              // reset toàn bộ form
              setName("")
              setBrandId(null)
              setCategoryId(null)
              setDescription("")
              setUploadedImages([])
              setSelectedConfigs([])
              setConfigPrices({})
              setConfigQuantities({})
              setSelectedFiles([])
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
                <TableHead className="font-semibold text-gray-900 text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProducts.map((product) => (
                <TableRow key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-900 py-4">#{product.id}</TableCell>
                  <TableCell className="py-4">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      width={100}
                      height={100}
                      className="rounded-lg h-25 object-cover"
                      unoptimized
                    />
                  </TableCell>
                  <TableCell className="font-medium text-gray-900 py-4">{product.name}</TableCell>
                  <TableCell className="text-gray-700 py-4">{product.brand.name}</TableCell>
                  <TableCell className="text-gray-700 py-4">{product.category.name}</TableCell>
                  <TableCell className="text-right py-4">
                    <div className="flex justify-end gap-2">
                      <Link href={`/products/${product.id}`}>
                        <Button variant="ghost" size="sm" className="hover:bg-blue-50">
                          <Eye className="h-4 w-4 text-blue-500" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedItem(product)
                          setIsEditModalOpen(true)
                          setUploadedImages(product.images || [])
                          const configs = mockData.product_details
                            .filter((pd) => pd.product_id === product.id)
                            .map((pd) => pd.config_id)
                          setSelectedConfigs(configs)
                          const quantities: Record<number, number> = {}
                          configs.forEach((configId) => {
                            quantities[configId] = 1
                          })
                          setConfigQuantities(quantities)
                          const prices: Record<number, number> = {}
                          configs.forEach((configId) => {
                            prices[configId] = mockData.configurations.find((c) => c.id === configId)?.price || 0
                          })
                          setConfigPrices(prices)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:bg-red-50" onClick={() => handleDelete(product.id)}>
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

      {/* Add Product Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm sản phẩm mới</DialogTitle>
            <DialogDescription>Nhập thông tin sản phẩm mới vào hệ thống</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Tên sản phẩm</Label>
              <Input placeholder="Nhập tên sản phẩm" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="w-full">
                <Label>Thương hiệu</Label>
                <Select onValueChange={(value) => setBrandId(Number(value))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn thương hiệu" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.length > 0 ? (
                      brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id.toString()}>
                          {brand.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="text-gray-400 text-sm p-2 italic">Không có thương hiệu</div>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Danh mục</Label>
                <Select
                  onValueChange={(value) => setCategoryId(Number(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="text-gray-400 text-sm p-2 italic">Không có danh mục</div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Mô tả chi tiết</Label>
              <Textarea placeholder="Nhập mô tả chi tiết sản phẩm" className="min-h-24" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div>
              <Label className="mb-3 block">Hình ảnh sản phẩm</Label>
              {/* ✅ Input file ẩn để click */}
              <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="grid grid-cols-4 gap-3">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Product ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleAddImage}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors"
                >
                  <Plus className="h-6 w-6 text-gray-400" />
                </button>
              </div>
            </div>

            <div>
              <Label className="mb-3 block font-semibold text-violet-700">Cấu hình sản phẩm</Label>
              <div className="space-y-3 max-h-60 overflow-y-auto border rounded-lg p-2 bg-white shadow-sm">
                {configurations.length > 0 ? (
                  configurations.map((config) => (
                    <div
                      key={config.id}
                      className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition"
                    >
                      <Checkbox
                        checked={selectedConfigs.includes(config.id)}
                        onCheckedChange={(checked) => handleCheckboxChange(!!checked, config)}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{config.name}</p>
                      </div>

                      {selectedConfigs.includes(config.id) && (
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Label className="text-sm whitespace-nowrap">Giá:</Label>
                            <Input
                              type="number"
                              min="0"
                              required
                              value={configPrices[config.id] ?? 0}
                              onChange={(e) => handleConfigPriceChange(config.id, Number(e.target.value) || 0)}
                              className="w-24 h-8"
                              placeholder="0"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-sm">SL:</Label>
                            <Input
                              type="number"
                              min="1"
                              required
                              value={configQuantities[config.id] ?? 1}
                              onChange={(e) => handleConfigQuantityChange(config.id, Number(e.target.value) || 1)}
                              className="w-16 h-8"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-sm italic p-3 text-center">
                    Không có cấu hình nào
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Hủy
            </Button>
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600" onClick={handleAddProduct}>
              Thêm sản phẩm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
            <DialogDescription>Cập nhật thông tin sản phẩm</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label>Tên sản phẩm</Label>
              <Input placeholder="Nhập tên sản phẩm" value={name}
                onChange={e => setName(e.target.value)} />
            </div>


            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Thương hiệu</Label>
                <Select value={brandId?.toString() || ""} onValueChange={(val) => setBrandId(Number(val))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn thương hiệu" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.length > 0 ? (
                      brands.map((b) => <SelectItem key={b.id} value={b.id.toString()}>{b.name}</SelectItem>)
                    ) : (
                      <div className="text-gray-400 text-sm p-2 italic">Không có thương hiệu</div>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Danh mục</Label>
                <Select value={categoryId?.toString() || ""} onValueChange={(val) => setCategoryId(Number(val))}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.length > 0 ? (
                      categories.map((c) => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)
                    ) : (
                      <div className="text-gray-400 text-sm p-2 italic">Không có danh mục</div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Mô tả chi tiết</Label>
              <Textarea placeholder="Nhập mô tả chi tiết sản phẩm" className="min-h-24" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div>
              <Label className="mb-3 block">Hình ảnh sản phẩm</Label>
              <div className="grid grid-cols-4 gap-3">
                {uploadedImages.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img src={img} alt={`Product ${idx}`} className="w-full h-24 object-cover rounded-lg" />
                    <button
                      onClick={() => handleRemoveImage(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={handleAddImage}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center hover:border-gray-400 transition-colors"
                >
                  <Plus className="h-6 w-6 text-gray-400" />
                </button>
                <input type="file" multiple accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
              </div>
            </div>

            <div>
              <Label className="mb-3 block font-semibold text-violet-700">Cấu hình sản phẩm</Label>
              <div className="space-y-3 max-h-60 overflow-y-auto border rounded-lg p-2 bg-white shadow-sm">
                {configurations.length > 0 ? (
                  configurations.map((config) => (
                    <div
                      key={config.id}
                      className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition"
                    >
                      <Checkbox
                        checked={selectedConfigs.includes(config.id)}
                        onCheckedChange={(checked) => handleCheckboxChange(!!checked, config)}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{config.name}</p>
                        {config.specifications?.length > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            {config.specifications.map((s: any) => `${s.name}: ${s.value}`).join(", ")}
                          </div>
                        )}
                      </div>

                      {/* Hiển thị ô nhập giá & SL nếu đã chọn */}
                      {selectedConfigs.includes(config.id) && (
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Label className="text-sm whitespace-nowrap">Giá:</Label>
                            <Input
                              type="number"
                              min="0"
                              required
                              value={configPrices[config.id] ?? 0}
                              onChange={(e) => handleConfigPriceChange(config.id, Number(e.target.value))}
                              className="w-24 h-8"
                              placeholder="0"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-sm">SL:</Label>
                            <Input
                              type="number"
                              min="1"
                              required
                              value={configQuantities[config.id] ?? 1}
                              onChange={(e) => handleConfigQuantityChange(config.id, Number(e.target.value))}
                              className="w-16 h-8"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-400 text-sm italic p-3 text-center">
                    Không có cấu hình nào
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Hủy
            </Button>
            <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600" onClick={handleUpdateProduct}>
              Cập nhật sản phẩm
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
