"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NousLogo } from "@/components/NousLogo";
import { Sparkles } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"Student" | "Teacher">("Student");

  const hasContent = email.length > 0 && password.length > 0;
  // Login button states
  const buttonStyle = hasContent ? "bg-[#2C3E55] shadow-[0_4px_16px_rgba(44,62,85,0.30)] text-[#FFFFFF]" : "bg-[rgba(138,154,170,0.6)] text-[#FFFFFF]";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[linear-gradient(135deg,_#E8E4DC_0%,_#D4DEEA_100%)] p-4">
      <div className="w-full max-w-[860px] h-[520px] bg-white rounded-[28px] shadow-[0_32px_80px_rgba(0,0,0,0.16),_0_4px_16px_rgba(0,0,0,0.06)] flex overflow-hidden">
        {/* LEFT PANEL */}
        <div className="w-1/2 p-[56px_48px] bg-[#F0EDE6] flex flex-col items-center relative">
          <div style={{ filter: "drop-shadow(0 4px 16px rgba(0,0,0,0.12))" }}>
            <NousLogo size={80} />
          </div>
          <h1 className="mt-4 text-[48px] font-[800] text-[#1A1A2E] tracking-[-2px] font-serif">Nous</h1>
          <p className="mt-1 text-[17px] text-[#6E6E73] tracking-[0.1px]">AI that grows your thinking.</p>
          
          <div className="flex-1 flex items-center justify-center w-full">
            <p className="text-[17px] font-[600] text-[#1A1A2E] leading-[1.7] text-center max-w-[280px]">
              Nous helps students learn by thinking, not by copying answers. Your ideas matter.
            </p>
          </div>

          <Sparkles className="absolute bottom-[24px] right-[24px] text-[#C0BBB3]" strokeWidth={1.5} size={18} />
        </div>

        {/* RIGHT PANEL */}
        <div className="w-1/2 p-[48px_44px] flex flex-col justify-center bg-[linear-gradient(160deg,_#C4D4E3_0%,_#B8CBDD_100%)]">
          <div className="w-full max-w-[380px] mx-auto bg-[rgba(255,255,255,0.55)] backdrop-blur-[20px] border border-[rgba(255,255,255,0.7)] rounded-[24px] p-[32px_28px] shadow-[0_8px_32px_rgba(0,0,0,0.10)]">
            
            {/* Segmented Control */}
            <div className="flex rounded-full bg-[rgba(255,255,255,0.35)] p-1 w-full mb-[24px]">
              <button 
                type="button"
                onClick={() => setRole("Student")}
                className={`flex-1 rounded-full py-[9px] text-[14px] font-[600] text-center transition-all duration-200 ${role === "Student" ? (hasContent ? "bg-[#2C3E55] text-white shadow-[0_2px_8px_rgba(44,62,85,0.30)]" : "bg-[#2C3E55] text-white shadow-[0_2px_8px_rgba(44,62,85,0.30)]") : "bg-transparent text-[#1A1A2E]"}`}
              >
                Student
              </button>
              <button 
                type="button"
                onClick={() => setRole("Teacher")}
                className={`flex-1 rounded-full py-[9px] text-[14px] font-[600] text-center transition-all duration-200 ${role === "Teacher" ? (hasContent ? "bg-[#2C3E55] text-white shadow-[0_2px_8px_rgba(44,62,85,0.30)]" : "bg-[#2C3E55] text-white shadow-[0_2px_8px_rgba(44,62,85,0.30)]") : "bg-transparent text-[#1A1A2E]"}`}
              >
                Teacher
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-[16px]">
              <div>
                <label className="block text-[14px] font-bold text-[#1A1A1A] mb-[8px]">Institution Email</label>
                <input 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-[52px] bg-[rgba(255,255,255,0.85)] rounded-[14px] px-[18px] text-[15px] text-[#1A1A2E] border border-[rgba(255,255,255,0.8)] outline-none transition-all duration-150 focus:border-[rgba(44,62,85,0.4)] focus:shadow-[0_0_0_3px_rgba(44,62,85,0.08)] focus:bg-[rgba(255,255,255,0.95)]"
                />
              </div>

              <div>
                <label className="block text-[14px] font-bold text-[#1A1A1A] mb-[8px]">Password</label>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-[52px] bg-[rgba(255,255,255,0.85)] rounded-[14px] px-[18px] text-[15px] text-[#1A1A2E] border border-[rgba(255,255,255,0.8)] outline-none transition-all duration-150 focus:border-[rgba(44,62,85,0.4)] focus:shadow-[0_0_0_3px_rgba(44,62,85,0.08)] focus:bg-[rgba(255,255,255,0.95)]"
                />
              </div>

              <button 
                type="submit"
                className={`w-full h-[52px] rounded-[14px] mt-[8px] text-[16px] font-[600] tracking-[-0.01em] transition-all duration-200 cursor-pointer ${buttonStyle}`}
              >
                Continue with University Login
              </button>
            </form>

            <p className="mt-[12px] text-center text-[12px] text-[#6E6E73] font-[400] tracking-[0.01em]">
              Authentication handled securely by your institution.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
