import React from 'react';
import { Select, Option } from "@material-tailwind/react";

// Đổi cách truyền `onSelectPdf`
function PdfDropdown({ pdfs, onSelectPdf }) {
  const handleChange = (value) => {
    if (value) {
      // 'value' ở đây sẽ là tên file (string)
      onSelectPdf(value); // <-- Truyền tên file
    }
  };

  return (
    <Select
      label="Chọn tài liệu..."
      onChange={handleChange}
      animate={{
        mount: {
          y: 0
        },
        unmount: {
          y: 25
        },
      }}
      className='bg-gray-50 text-gray-800 '
    >
      {/* Duyệt qua danh sách PDF và tạo các Option */}
      {pdfs.map((pdf) => (
        // Value của Option bây giờ là tên file (string)
        <Option key={pdf.name} value={pdf.name}> {/* <-- Key và Value là pdf.name */}
          {pdf.name}
        </Option>
      ))}
    </Select>
  );
}

export default PdfDropdown;