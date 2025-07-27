
import { Link } from "react-router-dom";
import {  Typography } from "@material-tailwind/react";

function HomePage() {
  return (
    // Đặt min-h-screen cho container ngoài cùng để đảm bảo chiếm hết chiều cao màn hình
    // và sử dụng flex-col để các phần tử xếp dọc
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-light-bg-begin to-white">
      {/* Container chính với padding và căn giữa */}
      <div className="container mx-auto flex flex-col flex-grow">
        {/* Logo DNP - giữ nguyên */}
        <div className="flex items-center justify-center pt-4 pb-4">
          {" "}
          {/* Thêm padding trên dưới để tạo khoảng trống */}
          <img
            src="/images/mobifone.png"
            alt="Mobifone Logo"
            className="object-cover object-center transition-transform duration-300 ease-in-out h-full w-13"
          />
        </div>
        <div className="flex flex-grow items-center justify-center">
          
          <div className="h-full flex flex-col md:flex-row items-center justify-center gap-4 w-full max-w-4xl">
            {" "}          
            <div className="w-full max-w-[250px] lg:max-w-[250px] p-4 flex flex-col items-center justify-center text-center">
              {" "}              
              <img
                src="/images/logo_ptd_noBg.png"
                alt="CraneCare"
                className="object-cover object-center transition-transform duration-300 ease-in-out h-30 w-30 mb-2"
              />
              {/* <img
                src="/images/text_crane_care.png"
                alt="CraneCare"
                className="w-full h-auto object-cover object-center transition-transform duration-300 ease-in-out"
              /> */}
            </div>
            {/* Logo Library */}
            <div className="w-full max-w-[100px] lg:max-w-[150px] p-4 flex flex-col items-center justify-center text-center transition-transform duration-300 ease-in-out hover:scale-110">
              {" "}              
              <Link to="/pdf-viewer">
                <img
                  src="/images/ptd_logo_libs.png"
                  alt="Crane Library"
                  className="w-full h-auto object-cover object-center "
                />
                <Typography className="mt-2 text-secondary-gray" variant="h5">
                  Thư viện tài liệu
                </Typography>
              </Link>
            </div>
            {/* Logo IQ */}
            <div className="w-full max-w-[100px] lg:max-w-[150px] p-4 flex flex-col items-center justify-center text-center transition-transform duration-300 ease-in-out hover:scale-110">
              {" "}
              {/* Thêm flex-col items-center justify-center text-center */}
              <Link to="/chatbot">
                <img
                  src="/images/ptd_logo_chatbot.png"
                  alt="Crane IQ"
                  className="w-full h-auto object-fit object-center "
                />
                <Typography className="mt-2 text-secondary-gray" variant="h5">
                  Chat với AI
                </Typography>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
