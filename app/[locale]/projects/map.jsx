
import dynamic from "next/dynamic";
import { useMemo } from "react";

export default async function PageM() {
    const Map = useMemo(() => dynamic(
        () => import('@/components/map/'),
        {
            loading: () => <p>A map is loading</p>,
            ssr: false
        }
    ), [])

    return (
        <>
            <div className="bg-white-700 mx-auto my-5 w-[98%] h-[780px]">
                <Map posix={[4.79029, -75.69003]} />
            </div>
        </>
    )
}