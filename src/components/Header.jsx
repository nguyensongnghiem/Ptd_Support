import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="flex justify-between w-full items-center gap-x-4 border-b border-gray-200 bg-white px-4 py-2 shadow-md">
      {/* Bọc logo trong thẻ <a> để tạo liên kết */}
      <Link to="/" className="flex items-center">
        {" "}
        {/* Thêm flex items-center để giữ ảnh và text logo thẳng hàng nếu có */}
        <img src="/images/app_logo.png" alt="logo" className="h-10 mr-3" />
        {/* Nếu bạn muốn có text bên cạnh logo, hãy thêm vào đây */}
        {/* <span className="text-lg font-bold text-blue-800">Tên trang chủ của bạn</span> */}
      </Link>
      {/* Thẻ span cũ có vẻ trống, tôi sẽ giữ nó nếu bạn có ý định dùng sau này, hoặc có thể xóa đi */}
      <Link to="/" className="flex items-center">
        <img src="/images/cang_logo.png" alt="logo" className="h-10 mr-3" />
      </Link>
      {/* <span className="text-lg font-bold text-blue-800">
      </span> */}
    </header>
  );
};

export default Header;
