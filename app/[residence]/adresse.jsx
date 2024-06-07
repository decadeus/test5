import React from "react";

export default function Adresse({ name, adresse, code_postal, city, maintitle }) {
  return (
    <div className="flex flex-col justify-center items-center">
      <p className="font-bold">{maintitle}</p>
      <p className="font-extrabold text-2xl">{name}</p>
      <p>{adresse}</p>
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
