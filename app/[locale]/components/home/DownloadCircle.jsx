import { useState } from "react";

export default function DownloadCircle({ icon, qrImg, color, label }) {
  const [open, setOpen] = useState(false);
  
  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => setOpen((v) => !v)}
        className="focus:outline-none"
        style={{
          transition: "all 0.3s cubic-bezier(.4,2,.6,1)",
          width: open ? 120 : 40,
          height: open ? 120 : 40,
          borderRadius: "50%",
          background: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
          position: "relative",
          zIndex: 10,
          padding: 0,
        }}
        aria-label={label}
      >
        {!open ? (
          icon
        ) : (
          <div className="flex flex-col items-center p-2">
            <img
              src={qrImg}
              alt="QR code"
              style={{
                width: 70,
                height: 70,
                borderRadius: 8,
                background: "#fff",
              }}
            />
            <span className="text-xs text-white mt-2">Scannez-moi</span>
          </div>
        )}
      </button>
      <span className="mt-2 text-xs text-gray-700 font-semibold">{label}</span>
    </div>
  );
} 