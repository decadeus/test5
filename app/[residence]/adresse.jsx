import React from "react";

export default function Adresse({ name, adresse1, adresse2, code_postal, city, maintitle }) {
  return (
    <div className="flex flex-col justify-center items-center border p-8">
      <p className="font-bold">{maintitle}</p>
      <p className="font-extrabold text-2xl">{name}</p>
      <p>{adresse1}</p>
      <p>{adresse2}</p>
      <div className="flex gap-2">
        <div>
          <p>{code_postal}</p>
        </div>
        <div>
          <p>{city}</p>
        </div>
      </div>
    </div>
  );
}
