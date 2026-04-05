import { test, expect, type Page } from '@playwright/test';

// Định nghĩa URL Admin và thông tin đăng nhập
const BASE_URL_ADMIN = 'http://localhost:3001';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = '123@123';

// Dùng .serial để ép con Bot chạy 1 mạch từ trên xuống dưới, giữ phiên đăng nhập
test.describe.serial('TechStore Automation Test - Giao diện Admin', () => {
  
  let page: Page; // Khai báo 1 tab Chrome xài chung

  // Bật đúng 1 tab lên trước khi test và thực hiện Đăng nhập Admin chung
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    
    // Luồng Đăng nhập Admin chung cho toàn bộ các test
    await page.goto(`${BASE_URL_ADMIN}`); 
    await page.getByPlaceholder(/Nhập username/i).fill(ADMIN_USERNAME); 
    await page.getByPlaceholder(/Nhập mật khẩu/i).fill(ADMIN_PASSWORD);
    await page.getByRole('button', { name: /đăng nhập/i }).click();
    
    // Chờ cho đến khi chuyển đến Dashboard
    // await expect(page).toHaveURL(`${BASE_URL_ADMIN}/dashboard`); // Sửa lại URL Dashboard nếu khác nhé
    await page.waitForTimeout(2000);
  });

  // Chạy xong các test thì đóng tab dọn rác
  test.afterAll(async () => {
    await page.close();
  });

  // =======================================================
  // LUỒNG 1: DỰ ĐOÁN AI (CÓ ĐỢI LOAD DATA LÂU)
  // =======================================================
  test('TC_01: Dự đoán AI - Click vào kiểm tra model và load data', async () => {
    // 1. Vào trang phân tích AI (Mở comment dòng dưới nếu ông biết menu selector, không thì goto thẳng)
    // await page.getByRole('link', { name: /AI Phân tích/i }).click(); 
    await page.goto(`${BASE_URL_ADMIN}/ai-analytics`); // Sửa lại URL AI nếu khác nhé

    // 2. Click vào nút "Dự đoán AI" hoặc tương tự
    // Ông nói là "đợi cũng khá lâu", nên mình sẽ tăng timeout cho việc kiểm tra element sau khi load
    // Giả sử có một element hiển thị data là 'Predictions Data' (Sửa lại text hoặc selector thật nhé)
    const loadedDataSelector = 'text=Kết quả dự đoán'; 

    // Bấm nút bắt đầu dự đoán
    await page.getByRole('button', { name: /bắt đầu dự đoán/i }).click();

    // 3. Click vào nút "K.tra Model" (Model Check)
    await page.getByRole('button', { name: /K.tra Model/i }).click();

    // 4. Đợi data load ra - Tăng timeout lên 60 giây (60000ms) hoặc cao hơn
    await expect(page.locator(loadedDataSelector)).toBeVisible({ timeout: 60000 });
    
    // 5. Assert thêm: Đảm bảo data load ra có nội dung, ví dụ tên sản phẩm (Sửa lại text hoặc selector thật nhé)
    await expect(page.locator(loadedDataSelector)).toContainText('iPhone 15 Thường');
  });

  // =======================================================
  // LUỒNG 2: QUẢN LÝ ĐƠN HÀNG (TÌM, XEM, SỬA TRẠNG THÁI)
  // =======================================================
  test('TC_02: Quản lý đơn hàng - Tìm, xem chi tiết và sửa trạng thái', async () => {
    // 1. Vào trang Quản lý đơn hàng
    // await page.getByRole('link', { name: /Đơn hàng/i }).click(); 
    await page.goto(`${BASE_URL_ADMIN}/orders`); // Sửa lại URL Orders nếu khác nhé

    // 2. Kiểm tra danh sách đơn hàng có hiển thị không
    await expect(page.locator('table')).toBeVisible();

    // 3. Chọn một đơn hàng bất kỳ (Ví dụ: tìm kiếm đơn hàng có mã "ORD123")
    // Ông sửa lại placeholder thật trên ô search đơn hàng nhé
    await page.getByPlaceholder(/Tìm kiếm đơn hàng/i).fill('ORD123');
    await page.getByPlaceholder(/Tìm kiếm đơn hàng/i).press('Enter');

    // 4. Click "Xem chi tiết" (Nút có chữ hoặc icon trong hàng)
    // Giả sử có nút 'Xem chi tiết' trong mỗi hàng
    await page.getByRole('button', { name: /Xem chi tiết/i }).first().click();

    // 5. Click nút "Sửa thông tin" (Sửa trạng thái) trong modal chi tiết
    await page.getByRole('button', { name: /Sửa thông tin/i }).click();

    // 6. Cập nhật trạng thái mới
    // Chọn trạng thái: Đang giao hàng (Sửa lại label của radio button/dropdown nhé)
    // Tui dùng label text, ông sửa lại Regex cho khớp với text thật trên UI nhé.
    await page.getByLabel(/Đang giao hàng/i).click(); 
    // await page.getByLabel(/Đã huỷ/i).click(); // Nếu muốn hủy

    // 7. Click nút "Xác nhận" trong modal cập nhật
    await page.getByRole('button', { name: /Xác nhận/i }).click();

    // 8. Chờ modal cập nhật đóng và kiểm tra trạng thái trong chi tiết đơn hàng
    await expect(page.getByRole('button', { name: /Sửa thông tin/i })).toBeVisible(); // Modal cập nhật đã đóng
    await expect(page.locator('.order-status-text')).toContainText('Đang giao hàng'); // Check text trạng thái đã sửa
  });

});