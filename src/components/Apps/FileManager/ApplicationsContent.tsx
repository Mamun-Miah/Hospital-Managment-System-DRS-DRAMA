"use client";

import React from "react";
import Image from "next/image";

const cardData = [
  {
    icon: "/images/icons/figma.svg",
    title: "ET Template",
    files: "159 Files",
    size: "4.5 GB",
  },
  {
    icon: "/images/icons/dribbble.svg",
    title: "React Template",
    files: "522 Files",
    size: "5.5 GB",
  },
  {
    icon: "/images/icons/spotify.svg",
    title: "Material UI",
    files: "995 Files",
    size: "7.5 GB",
  },
  {
    icon: "/images/icons/gitlab.svg",
    title: "WP Themes",
    files: "39 Files",
    size: "3.8 GB",
  },
  {
    icon: "/images/icons/google-drive.svg",
    title: "Personal Photos",
    files: "75 Files",
    size: "2.2 GB",
  },
  {
    icon: "/images/icons/trello.svg",
    title: "Mobile Apps",
    files: "357 Files",
    size: "8.5 GB",
  },
  {
    icon: "/images/icons/slack.svg",
    title: "Important Files",
    files: "159 Files",
    size: "4.5 GB",
  },
  {
    icon: "/images/icons/pinterest.svg",
    title: "Angular Template",
    files: "522 Files",
    size: "5.5 GB",
  },
  {
    icon: "/images/icons/facebook.svg",
    title: "Projects",
    files: "995 Files",
    size: "7.5 GB",
  },
  {
    icon: "/images/icons/linkedin.svg",
    title: "Documents",
    files: "39 Files",
    size: "3.8 GB",
  },
];

const ApplicationsContent: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-[25px] mb-[25px]">
      {cardData.map((card, index) => (
        <div
          key={index}
          className="trezo-card bg-white dark:bg-[#0c1427] p-[20px] md:p-[25px] rounded-md"
        >
          <div className="trezo-card-content">
            <div className="form-check">
              <input type="checkbox" className="cursor-pointer" />
            </div>
            <div className="mt-[20px] md:mt-[30px] lg:mt-[40px] flex items-center">
              <div className="leading-none ltr:mr-[12px] rtl:ml-[12px]">
                <Image
                  src={card.icon}
                  alt={`${card.title}-icon`} 
                  width={30}
                  height={30}
                />
              </div>
              <h6 className="!mb-0 !text-[15px]">{card.title}</h6>
            </div>
            <div className="mt-[20px] md:mt-[30px] lg:mt-[40px] flex items-center justify-between">
              <div className="block text-sm text-black dark:text-white">
                {card.files}
              </div>
              <div className="block text-sm text-black dark:text-white">
                {card.size}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApplicationsContent;
