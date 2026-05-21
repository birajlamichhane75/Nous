import Link from "next/link";
import { MoreHorizontal, Check, ChevronLeft } from "lucide-react";

export default function TeachingContribution() {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-[40px]">
        <div>
          <Link href="/dashboard" className="inline-flex items-center gap-[6px] text-[14px] text-[#6E6E73] font-[500] hover:text-[#1A1A2E] transition-colors cursor-pointer">
            <ChevronLeft size={16} strokeWidth={2} /> Dashboard
          </Link>
          <div className="mt-[16px]">
            <h1 className="page-title">Teaching Contribution</h1>
            <p className="mt-[6px] text-[15px] text-[#6E6E73] select-none">Impact you've made teaching peers.</p>
          </div>
        </div>
        <button className="text-[#6E6E73] hover:text-[#1A1A2E]">
          <MoreHorizontal size={20} strokeWidth={2} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
        {/* Card 1 */}
        <div className="frosted-glass p-[32px] border-l-[3px] border-l-[#7C6AED]">
          <p className="text-[11px] font-[600] text-[#6E6E73] uppercase tracking-[0.08em] mb-[8px]">Topic Taught</p>
          <h2 className="text-[20px] font-[700] text-[#1A1A2E] tracking-[-0.01em] leading-[1.3]">Limits: Conceptual Support</h2>
          
          <div className="mt-[24px] flex items-center justify-between">
            <span className="badge-teaching">Teaching Credit: 4.8</span>
            <div className="w-[28px] h-[28px] rounded-full bg-[#EBF5FF] text-[#3B82F6] flex items-center justify-center">
              <Check size={14} strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="frosted-glass p-[32px] border-l-[3px] border-l-[#7C6AED]">
          <p className="text-[11px] font-[600] text-[#6E6E73] uppercase tracking-[0.08em] mb-[8px]">Topic Taught</p>
          <h2 className="text-[20px] font-[700] text-[#1A1A2E] tracking-[-0.01em] leading-[1.3]">Calculus I Peer Group</h2>
          
          <div className="mt-[24px] flex items-center justify-between">
            <span className="badge-teaching">Teaching Credit: 4.7</span>
            <div className="w-[28px] h-[28px] rounded-full bg-[#EBF5FF] text-[#3B82F6] flex items-center justify-center">
              <Check size={14} strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="frosted-glass p-[32px] border-l-[3px] border-l-[#7C6AED]">
          <p className="text-[11px] font-[600] text-[#6E6E73] uppercase tracking-[0.08em] mb-[8px]">Topic Taught</p>
          <h2 className="text-[20px] font-[700] text-[#1A1A2E] tracking-[-0.01em] leading-[1.3]">Partial Differentiation Quiz Prep</h2>
          
          <div className="mt-[24px] flex items-center justify-between">
            <span className="badge-teaching">Teaching Credit: 4.6</span>
            <div className="w-[28px] h-[28px] rounded-full bg-[#EBF5FF] text-[#3B82F6] flex items-center justify-center">
              <Check size={14} strokeWidth={2.5} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
