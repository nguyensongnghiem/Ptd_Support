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
        'primary-orange': '#FE7743',  // Ví dụ: màu cam chính của bạn
        'secondary-gray': '#273F4F', // Ví dụ: màu xanh phụ
        'light-bg-begin' :'#91b9ceff',
        'light-bg-end' :'#447D9B',
        'primary-purple': '#704f89',
        'brand-red': '#FE7743',
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

