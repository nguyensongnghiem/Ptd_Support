import React from "react";
import { Link } from "react-router-dom";
import { Card, CardBody, Button, Typography } from "@material-tailwind/react";
import {
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

function HomePage() {
  return (
    // Đặt min-h-screen cho container ngoài cùng để đảm bảo chiếm hết chiều cao màn hình
    // và sử dụng flex-col để các phần tử xếp dọc
    <div className="flex flex-col min-h-screen bg-gray-300">
      {/* Container chính với padding và căn giữa */}
      <div className="container mx-auto p-4 flex flex-col flex-grow">
        {/* Logo DNP - giữ nguyên */}
        <div className="flex items-center justify-center pt-8 pb-4"> {/* Thêm padding trên dưới để tạo khoảng trống */}
          <img
            src="/images/logo_ptd.png"
            alt="CraneCare"
            className="object-cover object-center transition-transform duration-300 ease-in-out h-full w-24"
          />
        </div>

        {/* Khối div chứa 3 logo chính - chiếm hết phần còn lại và căn giữa */}
        {/* flex-grow để chiếm hết không gian còn lại theo chiều dọc */}
        {/* items-center và justify-center để căn giữa nội dung bên trong */}
        <div className="flex flex-grow items-center justify-center">
          {/* Vẫn giữ flex-col md:flex-row để các logo xếp hàng ngang trên desktop */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full max-w-4xl"> {/* Thêm max-w để giới hạn chiều rộng tổng thể */}
            {/* Logo App (CraneCare) */}
            <div className="w-full max-w-[300px] lg:max-w-[350px] p-4 flex flex-col items-center justify-center text-center"> {/* Thêm text-center và flex-col items-center justify-center */}
              <img
                src="/images/app_logo.png"
                alt="CraneCare"
                className="object-cover object-center transition-transform duration-300 ease-in-out h-24 w-24 mb-2"
              />
              <img
                src="/images/text_crane_care.png"
                alt="CraneCare"
                className="w-full h-auto object-cover object-center transition-transform duration-300 ease-in-out"
              />
              
            </div>
            
            {/* Logo Library */}
            <div className="w-full max-w-[170px] lg:max-w-[220px] p-4 flex flex-col items-center justify-center text-center"> {/* Thêm flex-col items-center justify-center text-center */}
              <Link to="/pdf-viewer">
                <img
                  src="/images/panel_library.png"
                  alt="Crane Library"
                  className="w-full h-auto object-cover object-center transition-transform duration-300 ease-in-out hover:scale-110"
                />
              </Link>
              
            </div>
            
            {/* Logo IQ */}
            <div className="w-full max-w-[170px] lg:max-w-[220px] p-4 flex flex-col items-center justify-center text-center"> {/* Thêm flex-col items-center justify-center text-center */}
              <Link to="/chatbot">
                <img
                  src="/images/panel_IQ.png"
                  alt="Crane IQ"
                  className="w-full h-auto object-fit object-center transition-transform duration-300 ease-in-out hover:scale-110"
                />
              </Link>             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;