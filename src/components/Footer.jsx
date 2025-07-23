import React from "react";
import { Typography } from "@material-tailwind/react";

function Footer() {
  return (
    <footer className="w-full h-[20px] bg-light-bg-begin shadow-md flex-shrink-0 border-t border-gray-200">
      <div className="mx-auto text-center">
        {/* <Typography color="blue-gray" className="font-normal">
          &copy; {new Date().getFullYear()} Tech Support Portal. All Rights
          Reserved.
        </Typography> */}
        <Typography color="white" className="text-sm ">
          &copy; {new Date().getFullYear()} Developed by Nguyen Song Nghiem
        </Typography>
      </div>
    </footer>
  );
}

export default Footer;
