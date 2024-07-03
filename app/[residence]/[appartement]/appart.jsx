"use client";
import React, { useCallback } from "react";
import Avatar from "@/app/getimage/Ugetone";
import useEmblaCarousel from "embla-carousel-react";
import { MdOutlinePool, MdFitnessCenter } from "react-icons/md";

function Appart({ b1i,b2i, b3i,b4i, b2, t1, d1, m1, price, desprix, bed, bath, surface }) {
  const classna = "rounded-lg";
  const [emblaRef, emblaApi] = useEmblaCarousel();

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);
  return (
    <div className="flex-col xl:flex-col md:flew-row px-4 pb-4">
      <h1 className="text-center font-bold text-2xl pt-4">{m1}</h1>

      <div className="pt-4 hidden sm:flex flex-col xl:flex-row md:flex-col">
        <div className="w-full xl:w-2/3 xl:h-[600px] xl:pr-4 xl:pb-0  sm:w-full sm:h-[300px] sm:pb-4">
          <Avatar url={b1i} width={200} height={600} classn="rounded-l-xl" />
        </div>
        <div className="flex xl:flex-col xl:w-1/3 sm:flex-row sm:w-full ">
          <div className="h-[200px] xl:w-full sm:w-1/3">
            <Avatar url={b2i} width={200} height={600} classn="rounded-tr-xl" />
          </div>
          <div className="h-[200px] xl:w-full xl:py-4 xl:px-0 sm:px-4 sm:py-0 sm:w-1/3">
            <Avatar url={b3i} width={200} height={600} classn="" />
          </div>
          <div className="h-[200px] xl:w-full sm:w-1/3">
            <Avatar url={b4i} width={200} height={600} classn="rounded-br-xl" />
          </div>
        </div>
      </div>
      <div className="sm:hidden">
        <div className="embla" ref={emblaRef}>
          <div className="embla__container">
            <div className="embla__slide">
              <Avatar url={b1i} width={200} height={600} classn={classna} />
            </div>
            <div className="embla__slide">
              <Avatar url={b1i} width={200} height={600} classn={classna} />
            </div>
            <div className="embla__slide">
              <Avatar url={b1i} width={200} height={600} classn={classna} />
            </div>
          </div>
          <div className="flex flex-row justify-between  ">
            <button
              className="embla__prev absolute top-20 right-8 p-2 rounded-lg bg-white/70"
              onClick={scrollPrev}
            >
              Next
            </button>
            <button
              className="embla__next embla__prev absolute top-20 left-8 p-2 rounded-lg bg-white/70"
              onClick={scrollNext}
            >
              Prev
            </button>
          </div>
        </div>
      </div>
      <div className="py-4 flex flex-col bg-white mt-4 px-4 rounded-lg gap-8">
        <div className="flex flex-col gap-4 ">
          <h2 className="font-bold text-xl">{t1}</h2>
          <div>
          <Icone bed={bed} bath={bath} surface={surface} />
          </div>
          <hr />
          <div>
            <p>{d1}</p>
          </div>
        </div>
        <div className="">
          <Price price={price} desprix={desprix} />
        </div>
      </div>
     
    </div>
  );
}

export default Appart;

function Price({ price, desprix }) {
  return (
    <div className="shadow-lg p-4 rounded-xl flex flex-col gap-4">
      <div className="w-fit text-xl"><span className="font-bold">{price}</span> €/mois</div>
      <p>{desprix}</p>
      <button className="bg-red-600 text-white px-4 py-2 rounded-lg w-full">
        contacter le proprietairer
      </button>
    </div>
  );
}
function Icone({ bed, bath, surface }) {
  return (
    <>
      <div className="flex gap-2">
        <div>
          {surface !== 0 ? (
            <div className="flex gap-1">
              {surface}
              <p>m2</p>
            </div>
          ) : null}
        </div>
        <p>.</p>
        <div>
          {bed !== 0 ? (
            <div className="flex gap-1">
              {bed}
              <p>chambre(s)</p>
            </div>
          ) : null}
        </div>
        <p>.</p>
        <div>
          {bath !== 0 ? (
            <div className="flex gap-1">
              {bath}
              <p>salle de bain</p>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
