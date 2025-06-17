"use client";

import { FaAndroid, FaApple } from "react-icons/fa";
import DownloadCircle from "@/app/[locale]/components/home/DownloadCircle";

export default function DownloadButtons() {
  return (
    <>
      {/* Bloc fixe à gauche avec iOS, flèche et Android - Desktop */}
      <div
        className="fixed left-0 top-1/2 z-50 flex flex-col items-center gap-6 hidden md:flex"
        style={{
          transform: "translateY(-50%)",
          paddingLeft: "8px",
        }}
      >
        <DownloadCircle
          icon={<FaAndroid size={32} color="white" />}
          qrImg="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://play.google.com/store/apps/details?id=random.android.app"
          color="#3DDC84"
          label="Android"
        />
        <DownloadCircle
          icon={<FaApple size={32} color="white" />}
          qrImg="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://apps.apple.com/app/id1234567890"
          color="#222"
          label="iOS"
        />
      </div>

      {/* Version mobile des liens de téléchargement */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center items-center gap-4 bg-white/90 backdrop-blur-sm py-4 md:hidden">
        <DownloadCircle
          icon={<FaAndroid size={24} color="white" />}
          qrImg="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://play.google.com/store/apps/details?id=random.android.app"
          color="#3DDC84"
          label="Android"
        />
        <DownloadCircle
          icon={<FaApple size={24} color="white" />}
          qrImg="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://apps.apple.com/app/id1234567890"
          color="#222"
          label="iOS"
        />
      </div>
    </>
  );
} 