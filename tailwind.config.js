/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");
export default withMT({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Roboto", "sans-serif"],
    },
    extend: {
      colors: {
        'primary-orange': '#DA5A22',  // Ví dụ: màu cam chính của bạn
        'secondary-gray': '#3f5078', // Ví dụ: màu xanh phụ
        'light-bg-begin' :'#747496',
        'light-bg-end' :'#a6a6dd',
        'primary-purple': '#704f89',
        'brand-red': '#e74c3c',
        'custom-gray': { // Bạn cũng có thể định nghĩa các sắc thái
          100: '#f7fafc',
          900: '#1a202c',
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/typography') // Thêm plugin này
  ],
  
})

