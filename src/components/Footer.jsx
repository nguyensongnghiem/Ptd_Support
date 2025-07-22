import React from "react";
import { Typography } from "@material-tailwind/react";

function Footer() {
  return (
    <footer className="w-full bg-gray-700 shadow-md flex-shrink-0 border-t border-gray-200">
      <div className="container mx-auto text-center">
        {/* <Typography color="blue-gray" className="font-normal">
          &copy; {new Date().getFullYear()} Tech Support Portal. All Rights
          Reserved.
        </Typography> */}
        <Typography color="white" className="text-sm py-1  ">
          &copy; {new Date().getFullYear()} Developed by DigitHub
        </Typography>
      </div>
    </footer>
  );
}

export default Footer;
