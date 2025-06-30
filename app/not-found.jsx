'use client'
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function NotFound() {
  // Génère 60 étoiles aléatoires
  const stars = Array.from({ length: 60 }).map((_, i) => {
    const size = Math.random() * 2 + 1;
    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          background: 'white',
          opacity: Math.random() * 0.7 + 0.3,
          filter: 'blur(0.5px)',
          animation: `twinkle 2s infinite ${Math.random()}s alternate`,
        }}
      />
    );
  });

  // Une seule comète animée, angle cohérent avec la direction
  const cometRef = useRef();

  useEffect(() => {
    let timeout;
    const animateComet = () => {
      if (!cometRef.current) return;
      // Direction et angle synchronisés
      const directions = [
        { direction: 'ltr', angle: 0 }, // gauche -> droite (horizontal)
        { direction: 'rtl', angle: 0 }, // droite -> gauche (horizontal)
        { direction: 'ltr', angle: 25 }, // diagonale bas gauche -> droite
        { direction: 'rtl', angle: -25 }, // diagonale haut droite -> gauche
        { direction: 'ltr', angle: -20 }, // diagonale haut gauche -> droite
        { direction: 'rtl', angle: 20 }, // diagonale bas droite -> gauche
      ];
      const config = directions[Math.floor(Math.random() * directions.length)];
      const length = Math.random() * 60 + 60; // 60 à 120px
      const duration = Math.random() * 2 + 2; // 2 à 4 secondes
      const startTop = Math.random() * 80 + 5; // 5% à 85% du haut
      const startLeft = config.direction === 'ltr' ? '-10%' : '110%';
      const endLeft = config.direction === 'ltr' ? '110%' : '-10%';
      cometRef.current.style.width = `${length}px`;
      cometRef.current.style.height = `1px`;
      cometRef.current.style.top = `${startTop}%`;
      cometRef.current.style.left = startLeft;
      cometRef.current.style.opacity = 1;
      cometRef.current.style.transition = `none`;
      cometRef.current.style.transform = `rotate(${config.angle}deg)`;
      setTimeout(() => {
        if (!cometRef.current) return;
        cometRef.current.style.transition = `all ${duration}s linear`;
        cometRef.current.style.left = endLeft;
        cometRef.current.style.opacity = 0;
      }, 20);
      // Relance la comète après son passage + délai aléatoire (3 à 7s)
      timeout = setTimeout(animateComet, duration * 1000 + Math.random() * 4000 + 3000);
    };
    animateComet();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      }}
    >
      {/* Etoiles scintillantes + comète */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        {stars}
        <div
          ref={cometRef}
          style={{
            position: 'absolute',
            height: '1px',
            background: 'linear-gradient(90deg, #fff, #fff0)',
            borderRadius: '2px',
            boxShadow: '0 0 8px 2px #fff',
            opacity: 0,
            top: '0%',
            left: '-10%',
            zIndex: 1,
            pointerEvents: 'none',
            willChange: 'left, opacity',
          }}
        />
        <style>{`
          @keyframes twinkle {
            0% { opacity: 0.3; }
            100% { opacity: 1; }
          }
        `}</style>
      </div>

      <div style={{ position: 'relative', zIndex: 1, marginBottom: '2rem' }}>
        <Image
          src="/iconsad.png"
          alt="404 sad"
          width={256}
          height={256}
          style={{
            borderRadius: '50%',
            boxShadow: '0 4px 24px 0 rgba(34,197,94,0.15)',
            border: '3px solid #22c55e',
            background: '#fff',
            objectFit: 'cover',
            display: 'block',
          }}
          priority
        />
      </div>
      <h1
        style={{
          fontSize: '3.5rem',
          fontWeight: 900,
          color: '#22c55e',
          marginBottom: '1rem',
          textShadow: '2px 4px 16px #a7f3d0, 0 2px 0 #fff',
          letterSpacing: '-2px',
          lineHeight: 1.1,
          textTransform: 'uppercase',
          position: 'relative',
          zIndex: 1,
        }}
      >
        404 — Lost in Space?
      </h1>
      <p
        style={{
          fontSize: '1.35rem',
          color: '#e0e7ef',
          marginBottom: '2.5rem',
          maxWidth: 520,
          marginLeft: 'auto',
          marginRight: 'auto',
          background: 'rgba(34,197,94,0.07)',
          borderRadius: '1.5rem',
          padding: '1.2rem 2rem',
          boxShadow: '0 2px 8px 0 rgba(34,197,94,0.08)',
          fontWeight: 500,
          lineHeight: 1.5,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <span style={{ fontSize: '2rem', verticalAlign: 'middle', marginRight: 8 }}>🪐</span>
        Oops! The page you are looking for has drifted into the unknown.<br />
        <span style={{ fontSize: '1.1rem', color: '#16a34a' }}>
          But don't worry, you can always get back on track!
        </span>
      </p>
      <Link
        href="/"
        style={{
          padding: '1rem 2.5rem',
          borderRadius: '9999px',
          border: '2px solid #22c55e',
          color: '#fff',
          fontWeight: 800,
          background: '#22c55e',
          fontSize: '1.25rem',
          boxShadow: '0 4px 16px 0 rgba(34,197,94,0.13)',
          textDecoration: 'none',
          transition: 'all 0.2s',
          display: 'inline-block',
          letterSpacing: '0.03em',
          textTransform: 'uppercase',
          position: 'relative',
          zIndex: 1,
        }}
      >
        🚀 Back to homepage
      </Link>
    </div>
  );
} 