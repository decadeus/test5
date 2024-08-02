import React from "react";
import MostBeauty from "@/app/mainpage/mostbeauty";

function page() {
  const subtitle = "font-extrabold text-xl text-center";
  return (
    <div className="w-full">
      <div className="w-full bgcolorP pl-8 pb-8">
        <h1 className="text-3xl text-white pt-8">
          Existing or Project, find your dream apartement
        </h1>
        <h2 className="text-xl text-white pt-4"> Search by number of bedroom, size, country, city, price ...</h2>
      </div>
      <div className="px-16 pt-16">
        <div className="flex flex-col justify-start items-start text-start">
          <div>
            <h2 className={subtitle}>
              Recent searches for available residences
            </h2>
          </div>
          <div className="flex flex-col justify-start items-start">
            <h2 className={subtitle}>The most beautiful existing residences</h2>
            <MostBeauty />
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
