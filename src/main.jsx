import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@material-tailwind/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import Homepage from "./pages/HomePage.jsx"; // Trang chủ công khai
import PdfViewerPage from "./pages/PdfViewerPage.jsx";
import ChatbotPage from "./pages/ChatbotPage.jsx";
import Login from "./pages/Login.jsx"; // Đảm bảo bạn import LoginForm của bạn
import Unauthorized from "./pages/Unauthorized.jsx"; // Tạo một trang Unauthorized.jsx nếu chưa có

// Import AuthProvider và ProtectedRoute/PrivateRoutes
import AuthProvider from "./contexts/authContext.jsx"; // Đảm bảo đường dẫn chính xác
import PrivateRoutes from "./routes/PrivateRoutes.jsx";// Component PrivateRoutes đã cập nhật

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // App.jsx sẽ chứa Layout chung và các Outlet
    errorElement: <ErrorPage />,
    children: [
      {
        index: true, // Đây là trang mặc định cho path "/"
        element: <Homepage />, // Trang chủ công khai, không cần đăng nhập
      },
      {
        path: "login", // Tuyến đường cho trang đăng nhập
        element: <Login />,
      },
      {
        path: "unauthorized", // Tuyến đường cho trang không có quyền
        element: <Unauthorized />,
      },
      {
        // Nhóm các tuyến đường cần xác thực và kiểm tra vai trò
        element: <PrivateRoutes allowedRoles={["ROLE_USER", "ROLE_ADMIN"]} />, // Ví dụ: chỉ cho phép ROLE_USER hoặc ROLE_ADMIN
        children: [
          {
            path: "pdf-viewer", // path sẽ là /pdf-viewer
            element: <PdfViewerPage />,
          },
          {
            path: "chatbot", // path sẽ là /chatbot
            element: <ChatbotPage />,
          },
          // Thêm các tuyến đường được bảo vệ khác ở đây
        ],
      },
      // Các tuyến đường khác có thể được thêm vào đây, ví dụ: { path: "*", element: <NotFoundPage /> }
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      {/* AuthProvider bao bọc RouterProvider để cung cấp AuthContext cho toàn bộ ứng dụng */}
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);