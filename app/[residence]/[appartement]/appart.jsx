"use client";
import React, { useCallback } from "react";
import Avatar from "@/app/getimage/getone";
import useEmblaCarousel from "embla-carousel-react";

function Appart({ b1, b1i, b2, t1, d1, m1 }) {
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
      <h1 className="text-center font-bold text-xl pt-4">{m1}</h1>

      <div className="pt-4 hidden sm:flex flex-col xl:flex-row md:flex-col">
        <div className="w-full xl:w-2/3 xl:h-[600px] xl:pr-4 xl:pb-0  sm:w-full sm:h-[300px] sm:pb-4">
          <Avatar url={b1i} width={200} height={600} classn={classna} />
        </div>
        <div className="flex xl:flex-col xl:w-1/3 sm:flex-row sm:w-full ">
          <div className="h-[200px] xl:w-full sm:w-1/3">
            <Avatar url={b1i} width={200} height={600} classn={classna} />
          </div>
          <div className="h-[200px] xl:w-full xl:py-4 xl:px-0 sm:px-4 sm:py-0 sm:w-1/3">
            <Avatar url={b1i} width={200} height={600} classn={classna} />
          </div>
          <div className="h-[200px] xl:w-full sm:w-1/3">
            <Avatar url={b1i} width={200} height={600} classn={classna} />
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
      <div className="py-4 flex flex-col gap4 bg-white mt-4 px-4 rounded-lg">
        <div className="flex flex-col gap-4">
          <div>
            <p className="font-bold">Informations générale</p>
            <p>{t1}</p>
          </div>
          <div>
            <p className="font-bold">Á propos</p>
            <p>{d1}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Appart;
