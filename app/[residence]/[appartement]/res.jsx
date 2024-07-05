import React from "react";
import GoogleMaps from "./../googlemap";
import Adresse from "../adresse";
import Avatar from "@/app/getimage/Ugetone";
import BackLink from "./usepath";
import IconeS from "@/app/components/Icone";

export default function Res({
  mainTitle,
  mainpic,
  adresse1,
  adresse2,
  aut1,
  taut1,
  aut2,
  taut2,
  aut3,
  taut3,
  lata,
  lnga,
  adresse,
  code_postal,
  city,
}) {
  const line = "flex flex-col text-center items-center gap-4 p-2";

  const text = "";
  return (
    <div className="w-full px-4 pt-4 border pb-8 bg-gray-100">
      <h2 className="text-center flex justify-center pb-4 font-bold text-2xl">
       The residence
      </h2>
      <div className="flex flex-col pb-4 ">
        <div className="flex justify-center">
          <div className="w-full h-[200px] md:h-[400px]">
            <Avatar
              url={mainpic}
              width={200}
              height={200}
              className="rounded-lg"
            />
          </div>
        </div>
        <div className="flex flex-col justify-between  ">
          <div className="flex flex-col lg:flex-row justify-center pt-8 ">
            <div className={line}>
              <IconeS specificValue={aut1} size={30} />
              <div>
                <p className={text}>{taut1}</p>
              </div>
            </div>
            <div className={line}>
              <IconeS specificValue={aut2} size={30} />
              <p className={text}>{taut2}</p>
            </div>
            <div className={line}>
              <IconeS specificValue={aut3} size={30} />
              <p className={text}>{taut3}</p>
            </div>
          </div>
          <div className="pt-4 flex flex-col-reverse items-center w-full gap-4 md:flex-row">
            <div className="w-full md:w-1/2">
              <GoogleMaps lnga={lnga} lata={lata} height="h-64" />
            </div>
            <div className=" w-1/2 md:justify-center ">
            <div className="text-center">
              <Adresse
                maintitle={mainTitle}
                adresse1={adresse1}
                adresse2={adresse2}
                code_postal={code_postal}
                city={city}
              />
              </div>
              <div className="flex justify-center pt-8">
                <button className="bg-green-600 w-fit text-white py-2 px-4">
                  <BackLink>More information about the residence</BackLink>
                </button>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
