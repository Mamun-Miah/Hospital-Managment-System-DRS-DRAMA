"use client";

import React from "react";

const Footer: React.FC = () => {
  return (
    <>
      <div className="grow"></div>

      <footer className="bg-white dark:bg-[#0c1427] rounded-t-md px-[20px] md:px-[25px] py-[5px] md:py-[2px] text-center">
        <p>
          © <span className="text-purple-500">DRS DERMA</span>
          {/* <a
            href="https://envytheme.com/"
            target="_blank"
            className="text-primary-500 transition-all hover:underline"
          >
            MSSL
          </a> */}
        </p>
        <div>Software by: mapleitfirm.com</div>
      </footer>
    </>
  );
};

export default Footer;
