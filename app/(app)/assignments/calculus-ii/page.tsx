import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AssignmentList() {
  return (
    <div className="w-full">
      <Link href="/dashboard" className="inline-flex items-center gap-[6px] text-[14px] text-[#6E6E73] font-[500] hover:text-[#1A1A2E] transition-colors cursor-pointer">
        <ChevronLeft size={16} strokeWidth={2} /> Dashboard
      </Link>
      
      <h1 className="mt-[16px] text-[40px] font-[800] text-[#1A1A2E] tracking-[-0.04em]">Calculus II</h1>

      <div className="flex flex-col gap-[20px] mt-[40px]">
        {/* Row 1 */}
        <Link href="/workspace/problem-set-3" className="group block w-full frosted-glass p-[24px] card-clickable relative">
          <div className="flex justify-between items-start">
            <h2 className="text-[18px] font-[600] text-[#1A1A2E] tracking-[-0.01em]">Double Integration Project</h2>
            <span className="text-[13px] text-[#6E6E73]">Due Nov 15</span>
          </div>
          <p className="text-[14px] text-[#6E6E73] leading-[1.5] mt-[4px]">Complete all assigned problems and show all work.</p>
          
          <div className="mt-[20px] flex items-center justify-between">
            <div className="flex items-center w-[55%] gap-[8px]">
              <div className="flex-1 progress-track">
                <div className="progress-fill-default progress-fill w-[75%]"></div>
              </div>
              <span className="text-[13px] text-[#6E6E73] font-variant-numeric tabular-nums">75%</span>
            </div>
            <span className="badge-in-progress">In Progress</span>
          </div>
          <div className="absolute right-[24px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight size={18} strokeWidth={2} className="text-[#D2D2D7]" />
          </div>
        </Link>

        {/* Row 2 */}
        <Link href="/workspace/problem-set-3" className="group block w-full frosted-glass p-[24px] card-clickable relative">
          <div className="flex justify-between items-start">
            <h2 className="text-[18px] font-[600] text-[#1A1A2E] tracking-[-0.01em]">Volume and Surface Area Quiz</h2>
            <span className="text-[13px] text-[#6E6E73]">Due Nov 12</span>
          </div>
          <p className="text-[14px] text-[#6E6E73] leading-[1.5] mt-[4px]">A timed quiz covering the last two lecture topics.</p>
          
          <div className="mt-[20px] flex items-center justify-between">
            <div className="flex items-center w-[55%] gap-[8px]">
              <span className="badge-not-started shrink-0">Not Started</span>
              <div className="flex-1 progress-track ml-[8px]">
                <div className="progress-fill-low progress-fill w-[0%]"></div>
              </div>
              <span className="text-[13px] text-[#6E6E73] font-variant-numeric tabular-nums">0%</span>
            </div>
          </div>
          <div className="absolute right-[24px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight size={18} strokeWidth={2} className="text-[#D2D2D7]" />
          </div>
        </Link>
        
        {/* Row 3 */}
        <Link href="/workspace/problem-set-3" className="group block w-full frosted-glass p-[24px] card-clickable relative">
          <div className="flex justify-between items-start">
            <h2 className="text-[18px] font-[600] text-[#1A1A2E] tracking-[-0.01em]">Review problems for Midterm</h2>
            <span className="text-[13px] text-[#6E6E73]">Due Nov 20</span>
          </div>
          <p className="text-[14px] text-[#6E6E73] leading-[1.5] mt-[4px]">Complete the practice set and post questions to the discussion board.</p>
          
          <div className="mt-[20px] flex items-center justify-between">
            <div className="flex items-center w-[55%] gap-[8px]">
              <span className="badge-in-progress shrink-0">In Progress</span>
              <div className="flex-1 progress-track ml-[8px]">
                <div className="progress-fill-low progress-fill w-[30%]"></div>
              </div>
              <span className="text-[13px] text-[#6E6E73] font-variant-numeric tabular-nums">30%</span>
            </div>
          </div>
          <div className="absolute right-[24px] top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight size={18} strokeWidth={2} className="text-[#D2D2D7]" />
          </div>
        </Link>
      </div>
    </div>
  );
}
