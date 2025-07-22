// src/components/PdfViewerIframe.jsx
import React, { useState } from 'react';

function PdfViewerIframe({ pdfUrl }) {
  // State mới để kiểm soát việc hiển thị overlay
  const [showMobileOverlay, setShowMobileOverlay] = useState(true);

  if (!pdfUrl) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Chọn một file PDF để xem.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex-grow w-full h-full overflow-hidden relative">
        {/* Iframe hiển thị trên mọi kích thước màn hình */}
        <iframe
          src={pdfUrl}
          title="Xem tài liệu PDF"
          className="w-full h-full border-none"
          // Các thuộc tính bảo mật tùy chọn nếu cần:
          // sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-downloads"
          // allow="fullscreen"
        >
          Trình duyệt của bạn không hỗ trợ hiển thị PDF trực tiếp.
          Vui lòng <a href={pdfUrl} target="_blank" rel="noopener noreferrer">tải xuống PDF</a> để xem.
        </iframe>

        {/*
          Overlay/Thông báo dành cho màn hình nhỏ (md trở xuống).
          Chỉ hiển thị nếu `showMobileOverlay` là true VÀ màn hình nhỏ hơn `lg`.
        */}
        {showMobileOverlay && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10 lg:hidden">
            {/* Modal/Card cho thông báo */}
            <div className="bg-white rounded-lg shadow-2xl p-6 md:p-8 max-w-sm mx-auto relative transform transition-all duration-300 ease-in-out scale-100 opacity-100">
              {/* Nút đóng */}
              <button
                onClick={() => setShowMobileOverlay(false)}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition-colors duration-200"
                aria-label="Đóng thông báo"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Icon thông báo */}
              <div className="flex justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>

              {/* Tiêu đề và nội dung thông báo */}
              <p className="text-xl md:text-2xl font-bold text-blue-900 mb-3 text-center">
                Xem Tài liệu trên Mobile
              </p>
              <p className="text-sm text-gray-700 mb-6 text-center">
                Để có trải nghiệm xem tài liệu tốt nhất trên màn hình nhỏ, chúng tôi đề xuất mở PDF này ở tab mới.
              </p>

              {/* Nút "Mở tài liệu ở tab mới" */}
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center justify-center space-x-2
                           hover:bg-blue-700 transition-colors duration-200 text-base md:text-lg font-semibold"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
                <span>Mở tài liệu ở tab mới</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PdfViewerIframe;