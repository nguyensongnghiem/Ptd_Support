import React, { useState, useEffect, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { IconButton, Typography, Input, Button } from "@material-tailwind/react";
import {
  FaSearchMinus,
  FaSearchPlus,
  FaChevronLeft,
  FaChevronRight,
  FaExternalLinkAlt,
  FaDownload,
  FaPrint,
  FaAngleDoubleRight
} from "react-icons/fa";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

function PdfViewer({ pdfUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [gotoPageInput, setGotoPageInput] = useState("");

  useEffect(() => {
    setScale(1.0);
    setGotoPageInput("");
    setCurrentPageNum(1);
  }, [pdfUrl]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setCurrentPageNum(1);
  }

  const zoomOut = useCallback(() => setScale((s) => Math.max(s - 0.2, 0.4)), []);
  const zoomIn = useCallback(() => setScale((s) => Math.min(s + 0.2, 3.0)), []);

  const goToPage = useCallback((pageNumber) => {
    if (pageNumber > 0 && pageNumber <= numPages) {
      setCurrentPageNum(pageNumber);
      const pageElement = document.getElementById(`pdf-page-${pageNumber}`);
      if (pageElement) {
        pageElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [numPages]);

  const goToNextPage = useCallback(() => {
    if (currentPageNum < numPages) {
      goToPage(currentPageNum + 1);
    }
  }, [currentPageNum, numPages, goToPage]);

  const goToPrevPage = useCallback(() => {
    if (currentPageNum > 1) {
      goToPage(currentPageNum - 1);
    }
  }, [currentPageNum, goToPage]);

  const handleGoToPageInput = useCallback(() => {
    const page = parseInt(gotoPageInput, 10);
    if (page > 0 && page <= numPages && page !== currentPageNum) { // Thêm điều kiện page !== currentPageNum
      goToPage(page);
      setGotoPageInput(""); // Clear input after valid jump
    } else if (page === currentPageNum) {
      setGotoPageInput(""); // Nếu nhập đúng trang hiện tại thì cũng clear input
    } else {
      alert(`Vui lòng nhập số trang hợp lệ từ 1 đến ${numPages || "?"}.`);
      setGotoPageInput(""); // Clear input nếu không hợp lệ
    }
  }, [gotoPageInput, numPages, currentPageNum, goToPage]);

  const handlePageScroll = useCallback(() => {
    const pdfContainer = document.querySelector('.custom-scrollbar');
    if (!pdfContainer) return;

    const pages = pdfContainer.querySelectorAll('[id^="pdf-page-"]');
    if (!pages.length) return;

    let currentVisiblePage = currentPageNum;
    let maxVisibleHeight = 0;
    let closestPageNum = currentPageNum;
    let minDistance = Infinity;

    const containerTop = pdfContainer.scrollTop;
    const containerBottom = containerTop + pdfContainer.clientHeight;

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      const pageTop = page.offsetTop;
      const pageBottom = pageTop + page.offsetHeight;

      const visibleTop = Math.max(pageTop, containerTop);
      const visibleBottom = Math.min(pageBottom, containerBottom);
      const visibleHeight = visibleBottom - visibleTop;

      if (visibleHeight > 0 && visibleHeight > maxVisibleHeight) {
        currentVisiblePage = i + 1;
        maxVisibleHeight = visibleHeight;
      }

      const distance = Math.abs(pageTop - containerTop);
      if (distance < minDistance) {
        minDistance = distance;
        closestPageNum = i + 1;
      }
    }

    if (maxVisibleHeight > (pages[0]?.offsetHeight * 0.5 || 0)) {
      if (currentVisiblePage !== currentPageNum) {
        setCurrentPageNum(currentVisiblePage);
      }
    } else {
      if (closestPageNum !== currentPageNum) {
        setCurrentPageNum(closestPageNum);
      }
    }
  }, [currentPageNum]);

  useEffect(() => {
    const pdfContainer = document.querySelector('.custom-scrollbar');
    if (pdfContainer) {
      pdfContainer.addEventListener('scroll', handlePageScroll);
      handlePageScroll();
      return () => {
        pdfContainer.removeEventListener('scroll', handlePageScroll);
      };
    }
  }, [handlePageScroll]);


  const handleOpenInNewTab = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  const handleDownloadPdf = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = pdfUrl.substring(pdfUrl.lastIndexOf('/') + 1) || 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePrintPdf = () => {
    if (pdfUrl) {
      const printWindow = window.open(pdfUrl, '_blank');
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  // Điều kiện hiển thị nút "Đi đến trang" (FaAngleDoubleRight)
  const showGoToPageButton =
    gotoPageInput !== "" &&
    parseInt(gotoPageInput, 10) > 0 &&
    parseInt(gotoPageInput, 10) <= numPages &&
    parseInt(gotoPageInput, 10) !== currentPageNum;

  return (
    <div className="flex flex-col h-full w-full">
      {/* Thanh điều khiển PDF */}
      <div className="flex flex-wrap justify-between items-center gap-2 sm:gap-1 px-2 py-2 md:px-4 md:py-3 border-b border-gray-200 bg-gray-300 flex-shrink-0">
        
        {/* Nhóm trái: Zoom và thông tin trang */}
        <div className="flex items-center gap-0 sm:gap-2 flex-shrink-0">
          <IconButton
            size="sm"
            color="blue-gray"
            variant="text"
            onClick={zoomOut}
            className="rounded-full"
            disabled={scale <= 0.4}
            title="Thu nhỏ"
          >
            <FaSearchMinus size={16} />
          </IconButton>
          <Typography
            variant="small"
            color="blue-gray"
            className="font-medium min-w-[50px] text-center text-xs sm:text-sm"
          >
            {(scale * 100).toFixed(0)}%
          </Typography>
          <IconButton
            size="sm"
            color="blue-gray"
            variant="text"
            onClick={zoomIn}
            className="rounded-full"
            disabled={scale >= 3.0}
            title="Phóng to"
          >
            <FaSearchPlus size={16} />
          </IconButton>
        </div>

        {/* PHẦN ĐIỀU HƯỚNG TRANG ĐÃ ĐƯỢC CHỈNH SỬA */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0 justify-center">
          <IconButton
            size="sm"
            color="blue-gray"
            variant="text"
            onClick={goToPrevPage}
            className="rounded-full"
            disabled={currentPageNum <= 1}
            title="Trang trước"
          >
            <FaChevronLeft size={16} />
          </IconButton>

          {/* Input "Trang" và hiển thị tổng số trang - Cải tiến căn chỉnh và kích thước */}
          <div className="flex items-center gap-0.5 justify-center">
            <Input
              type="number"
              // Đã loại bỏ onBlur ở đây
              value={gotoPageInput === "" ? currentPageNum : gotoPageInput}
              onChange={(e) => setGotoPageInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleGoToPageInput();
              }}
              className="!py-0.5 !text-sm text-center !max-w-[70px] min-w-[50px] h-[32px] !border-b-2"
              containerProps={{ className: "min-w-[50px] max-w-[70px] h-auto" }}
              labelProps={{ className: "hidden" }}
              crossOrigin=""
              color="blue-gray"
              variant="static"
            />
            <Typography
              variant="small"
              color="blue-gray"
              className="font-medium flex-shrink-0 text-xs sm:text-sm pt-1"
            >
              / {numPages || '?'}
            </Typography>
          </div>
          
          {/* Nút "Đi đến trang" (FaAngleDoubleRight) chỉ hiển thị khi có input và hợp lệ */}
          {showGoToPageButton && (
            <IconButton
              size="sm"
              color="blue-gray"
              variant="text"
              onClick={handleGoToPageInput}
              className="rounded-full"
              title="Đi đến trang"
            >
              <FaAngleDoubleRight size={16} />
            </IconButton>
          )}

          <IconButton
            size="sm"
            color="blue-gray"
            variant="text"
            onClick={goToNextPage}
            className="rounded-full"
            disabled={currentPageNum >= numPages}
            title="Trang kế tiếp"
          >
            <FaChevronRight size={14} />
          </IconButton>
        </div>

        {/* Nhóm phải: Các tùy chọn khác (Open, Download, Print) */}
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          {pdfUrl && (
            <>
              <IconButton
                size="sm"
                color="blue-gray"
                variant="text"
                onClick={handleDownloadPdf}
                className="rounded-full hidden sm:inline-flex"
                title="Tải xuống PDF"
              >
                <FaDownload size={14} />
              </IconButton>
              <IconButton
                size="sm"
                color="blue-gray"
                variant="text"
                onClick={handlePrintPdf}
                className="rounded-full hidden sm:inline-flex"
                title="In PDF"
              >
                <FaPrint size={14} />
              </IconButton>
              <IconButton
                size="sm"
                color="blue-gray"
                variant="text"
                onClick={handleOpenInNewTab}
                className="rounded-full "
                title="Mở trong tab mới"
              >
                <FaExternalLinkAlt size={14} />
              </IconButton>
            </>
          )}
        </div>
      </div>

      {/* Vùng hiển thị PDF có thanh cuộn riêng */}
      <div className="flex-grow overflow-y-auto bg-gray-100 flex flex-col items-center p-4 gap-4 custom-scrollbar  shadow-inner">
        {pdfUrl ? (
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error) => console.error("Lỗi khi tải PDF:", error)}
            className="w-full flex flex-col items-center"
          >
            {numPages &&
              Array.from(new Array(numPages), (el, index) => (
                <div
                  key={`pdf-page-${index + 1}`}
                  id={`pdf-page-${index + 1}`}
                  className="mb-4 shadow-lg bg-white rounded-md" // Thêm bo tròn nhẹ cho từng trang
                >
                  <Page
                    pageNumber={index + 1}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                    scale={scale}
                    className="mx-auto"
                  />
                </div>
              ))}
          </Document>
        ) : (
          <div className="flex items-center justify-center h-full w-full text-center text-gray-500">
            <Typography variant="lead">Vui lòng chọn một tài liệu để xem.</Typography>
          </div>
        )}
      </div>
    </div>
  );
}

export default PdfViewer;