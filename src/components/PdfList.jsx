import React, { useState, useEffect } from "react";
import { Input, Typography, Tooltip } from "@material-tailwind/react";
import { FaFilePdf, FaCheckCircle } from "react-icons/fa";

function PdfList({ pdfs, onSelectPdf, selectedPdfName }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const filteredPdfs = pdfs.filter((pdf) =>
    pdf.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col py-2">
      <div className="mb-4">
        <Input
          type="text"
          label="Tìm kiếm tài liệu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          color="cyan"
        />
      </div>
      <div className="w-full flex-1 overflow-y-auto custom-scrollbar space-y-1">
        {filteredPdfs.length > 0 ? (
          filteredPdfs.map((pdf) => {
            const isSelected = selectedPdfName === pdf.name;
            const displayName = pdf.name.replace(/\.pdf$/i, "");

            const content = (
              <div
                onClick={() => onSelectPdf(pdf.name)}
                className={`cursor-pointer border border-gray-200 rounded-md flex items-center gap-3 py-2 px-3 
                  transition-all duration-200 ease-in-out transform
                  ${
                    isSelected
                      ? "bg-blue-100 text-blue-800 font-semibold"
                      : "hover:bg-blue-50 hover:shadow-sm text-gray-800"
                  }`}
              >
                <FaFilePdf
                  className={`text-base font ${
                    isSelected ? "text-red-700" : "text-red-200"
                  }`}
                />
                <Typography
                  variant="small"
                  className={`flex-1 font-[500] break-words ${
                    isMobile ? "line-clapm-3" : "line-clamp-2"
                  }`}
                >
                  {displayName}
                </Typography>
                {isSelected && (
                  <FaCheckCircle className="text-blue-600 text-sm flex-shrink-0" />
                )}
              </div>
            );

            return isMobile ? (
              <div key={pdf.name}>{content}</div>
            ) : (
              <Tooltip content={pdf.name} placement="right" key={pdf.name}>
                {content}
              </Tooltip>
            );
          })
        ) : (
          <div className="text-center text-gray-500 py-4">
            <Typography variant="paragraph">
              Không tìm thấy tài liệu nào phù hợp.
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
}

export default PdfList;
