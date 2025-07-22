const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const https = require("https");

const app = express();
const PORT = 3002; // Cổng của server Node.js

// Thư mục chứa file muốn chia sẻ
const FOLDER_PATH = "/root/app/simple-file-server/docs";

// Bật CORS cho tất cả (có thể cấu hình chi tiết nếu cần)
app.use(cors());

// API: Lấy danh sách file (Đã cập nhật đường dẫn)
// Endpoint mới: GET https://digithub.io.vn:3001/api/files
app.get("/api/files", (req, res) => { // Thay đổi đường dẫn route ở đây
  fs.readdir(FOLDER_PATH, (err, files) => {
    if (err) {
      console.error("Không thể đọc thư mục:", err);
      return res.status(500).send("Lỗi server: Không thể đọc thư mục.");
    }
    const pdfFiles = files.filter(file => file.toLowerCase().endsWith('.pdf'));
    res.json(pdfFiles);
  });
});

// API: Lấy URL của file PDF (Đã cập nhật đường dẫn)
// Endpoint mới: GET https://digithub.io.vn:3001/api/pdf-url/your_document.pdf
app.get("/api/pdf-url/:filename", (req, res) => { // Thay đổi đường dẫn route ở đây
  const { filename } = req.params;
  const filePath = path.join(FOLDER_PATH, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "File không tồn tại." });
  }

  // Xây dựng URL công khai của file PDF
  // URL này vẫn trỏ đến endpoint phục vụ file PDF, bây giờ cũng có tiền tố /api
  const publicFileUrl = `${req.protocol}://${req.get('host')}/api/files/${filename}`;

  // Trả về JSON chứa URL
  res.json({ url: publicFileUrl });
});

// API: Tải file cụ thể (Giữ nguyên đường dẫn đã sửa đổi ở phần trước)
// Endpoint: GET https://digithub.io.vn:3001/api/files/your_document.pdf
app.get("/api/files/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(FOLDER_PATH, filename);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error("Lỗi khi gửi file:", err);
        if (!res.headersSent) {
          res.status(500).send("Lỗi khi gửi file.");
        }
      }
    });
  } else {
    res.status(404).send("File không tồn tại.");
  }
});

// Đường dẫn chứng chỉ SSL (Let’s Encrypt)
const sslOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/digithub.io.vn/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/digithub.io.vn/fullchain.pem'),
};

// Khởi động HTTPS server
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`✅ HTTPS Server đang chạy tại https://digithub.io.vn:${PORT}`);
  console.log(`📂 Chia sẻ file từ thư mục: ${FOLDER_PATH}`);
  console.log(`API lấy danh sách file: https://digithub.io.vn:${PORT}/api/files`);
  console.log(`API lấy URL PDF: https://digithub.io.vn:${PORT}/api/pdf-url/:filename`);
  console.log(`URL trực tiếp của file: https://digithub.io.vn:${PORT}/api/files/:filename`);
});