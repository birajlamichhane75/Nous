"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { NousLogo } from "@/components/NousLogo";

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 2000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[radial-gradient(ellipse_at_70%_50%,_#C8D8EA_0%,_#F0EDE8_60%,_#FFFFFF_100%)]">
      <div className="logo-entrance" style={{ filter: 'drop-shadow(0 8px 32px rgba(28, 60, 120, 0.25))' }}>
        <NousLogo size={220} />
      </div>
      <h1 className="mt-[28px] text-[#4A5568] tracking-[0.02em] text-[19px] font-[400] tagline fade-up">AI that grows your thinking.</h1>
    </div>
  );
}
