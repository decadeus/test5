import BouncingBackground from "./BouncingBackground";
import DualLayerFadeSection from "./DualLayerFadeSection";

export default function HomePage() {
  return (
    <main className=" w-full flex h-fit">
      
      <div className=" bg-white overflow-hidden w-full">
        <BouncingBackground />
       
      </div>
    </main>
  );
}
