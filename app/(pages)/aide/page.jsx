import React from "react";
import Link from "next/link";

const listeA = [
  {
    number: "A1",
    title: "Demarrer",
    text: "Configurez votre profil et apprenez tout ce qui concerne l'administration, comme la sécurité, les paramètres, etc.",
    url: "/aide/adminuser/start",
  },
  {
    number: "A2",
    title: "Another Title",
    text: "Lorem ipsum dolor",
    url: "//aide/adminuser/Demarrer",
  },
  {
    number: "A3",
    title: "Another Title",
    text: "Lorem ipsum dolor",
    url: "/another/url",
  },
];

const listeB = [
  {
    number: "U1",
    title: "Demarrer",
    text: "Configurez votre profil et apprenez tout ce qui concerne l'administration, comme la sécurité, les paramètres, etc.",
    url: "/aide/adminuser/demarrer",
  },
  {
    number: "U2",
    title: "Another Title",
    text: "Lorem ipsum dolor",
    url: "/another/url",
  },
  {
    number: "U3",
    title: "Another Title",
    text: "Lorem ipsum dolor",
    url: "/another/url",
  },
];

export default function Page() {
  return (
    <div className="flex w-full gap-4 px-24">
      <div className="w-1/2">
        <p className="text-xl font-normal">Pour les admins</p>
        {listeA.map((item) => (
          <div key={item.number} className="flex flex-col  shadow-md mb-4 rounded-md">
            <div className="flex">
                <div className="bg-blue-100 w-1/3 flex justify-center items-center text-6xl font-extra">
            <p className="text-gray-400">{item.number}</p>
            </div>
            <div className="flex flex-col p-4 gap-4 w-2/3">
              <h2 className="text-xl">{item.title}</h2>
              <p>{item.text}</p>
              <buton className="bg-blue-500 rounded-xl text-white w-fit px-8"><a className="text-center" href={item.url}>En savoir plus</a></buton>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-1/2">
        <p className="text-xl font-normal">Pour les utilisateurs</p>
        {listeB.map((item) => (
          <div key={item.number} className="flex flex-col  shadow-md mb-4 rounded-md">
          <div className="flex">
              <div className="bg-blue-100 w-1/3 flex justify-center items-center text-6xl font-extra">
          <p className="text-gray-400">{item.number}</p>
          </div>
          <div className="flex flex-col p-4 gap-4 w-2/3">
            <h2 className="text-xl">{item.title}</h2>
            <p>{item.text}</p>
            <Link className="bg-blue-900 rounded-xl text-white w-fit px-8" href={item.url}>En savoir plus</Link>
            </div>
          </div>
        </div>
        ))}
      </div>
    </div>
  );
}
