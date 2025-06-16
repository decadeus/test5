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
          width: open ? "120px" : "40px",
          height: open ? "120px" : "40px",
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
                width: "70px",
                height: "70px",
                borderRadius: "8px",
                background: "#fff",
              }}
            />
            <span className="text-xs text-white mt-2">Scannez-moi</span>
          </div>
        )}
      </button>
      <span className="mt-2 text-xs text-gray-700 font-semibold hidden md:block">{label}</span>
      {open && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setOpen(false)}>
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg">
            <img
              src={qrImg}
              alt="QR code"
              className="w-48 h-48 rounded-lg"
            />
            <p className="text-center mt-2 text-sm font-medium">{label}</p>
          </div>
        </div>
      )}
    </div>
  );
} 