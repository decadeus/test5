import React from "react";
import GoogleMaps from "./../googlemap";
import Adresse from "../adresse";
import Avatar from "@/app/getimage/getone_u";
import BackLink from "./usepath";
import IconeS from "@/app/components/Icone";

export default function Res({
  mainTitle,
  mainpic,
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
    <div className="w-full px-4 pt-4 border-l pb-8">
      <h2 className="text-center flex justify-center pb-4 font-bold text-2xl">
        La résidence
      </h2>
      <div className="flex">
        <div className="w-1/2">
          <div className="h-[400px]">
            <Avatar
              url={mainpic}
              width={200}
              height={200}
              className="rounded-lg"
            />
          </div>
        </div>
        <div className="flex flex-col px-16 justify-between">
          <div className="grid grid-cols-3 gap-2 pt-4 divide-x divide-slate-600">
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
          <div className="pt-4 flex items-center w-full gap-4 ">
            <div className="w-1/2">
              <GoogleMaps lnga={lnga} lata={lata} height="h-64" />
            </div>
            <div className="w-1/2">
              <Adresse
                maintitle={mainTitle}
                adresse={adresse}
                code_postal={code_postal}
                city={city}
              />
              <div className="flex justify-center pt-8">
                <button className="bg-green-600 w-fit text-white py-2 px-4">
                  <BackLink>En savoir plus sur la residence</BackLink>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
