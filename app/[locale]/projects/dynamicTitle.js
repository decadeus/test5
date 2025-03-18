// components/DynamicMetadata.js (Client Component)
"use client";
import { useEffect, useState } from "react";
import Head from "next/head";

export default function DynamicMetadata() {
    const [city, setCity] = useState("Chargement...");

    useEffect(() => {
        const storedCity = localStorage.getItem("selectedCity");
        if (storedCity) {
            setCity(storedCity);
        }
    }, []);

    return (
        <>
            <Head>
                <title>{city}</title>
                <meta name="description" content={`Découvrez ${city}`} />
            </Head>
            <h1>Bienvenue à {city}</h1>
        </>
    );
}
