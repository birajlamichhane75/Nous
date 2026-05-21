import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function TeachingOpportunities() {
  return (
    <div className="w-full max-w-[800px]">
      <div className="flex items-center justify-between mb-[40px]">
        <div>
          <Link href="/collaboration" className="inline-flex items-center gap-[6px] text-[14px] text-[#6E6E73] font-[500] hover:text-[#1A1A2E] transition-colors cursor-pointer">
            <ChevronLeft size={16} strokeWidth={2} /> AI Match Board
          </Link>
          <div className="mt-[16px]">
            <h1 className="page-title">Available Teaching Opportunities</h1>
            <p className="mt-[6px] text-[15px] text-[#6E6E73]">Review peers who need your mastery.</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-[20px] mt-[24px]">
        {/* Card 1 */}
        <div className="frosted-glass p-[24px] border-l-[3px] border-l-[#F59E0B]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-[12px]">
              <div className="w-[48px] h-[48px] rounded-full bg-[#E8E8EC] overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=Sarah+J&background=E8E8EC&color=1A1A2E" className="w-full h-full object-cover" />
              </div>
              <div>
                 <h2 className="text-[20px] font-[700] text-[#1A1A2E] tracking-[-0.01em]">Sarah J.</h2>
                 <p className="text-[14px] text-[#6E6E73]"><span className="text-split-orange">Needs help with:</span> Double Integration</p>
              </div>
            </div>
            <span className="badge-effort">Depth: Conceptual</span>
          </div>
          
          <div className="w-[1px] h-[1px] mt-[20px]"></div>

          <div className="flex justify-end border-t border-[rgba(0,0,0,0.06)] pt-[20px]">
            <Link href="/collaboration/active" className="btn-accent">
              Start Teaching
            </Link>
          </div>
        </div>

        {/* Card 2 */}
        <div className="frosted-glass p-[24px] border-l-[3px] border-l-[#F59E0B]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-[12px]">
              <div className="w-[48px] h-[48px] rounded-full bg-[#E8E8EC] overflow-hidden">
                <img src="https://ui-avatars.com/api/?name=Michael+L&background=E8E8EC&color=1A1A2E" className="w-full h-full object-cover" />
              </div>
              <div>
                 <h2 className="text-[20px] font-[700] text-[#1A1A2E] tracking-[-0.01em]">Michael L.</h2>
                 <p className="text-[14px] text-[#6E6E73]"><span className="text-split-orange">Needs help with:</span> L'Hôpital's Rule</p>
              </div>
            </div>
            <span className="badge-effort">Depth: Calculation</span>
          </div>
          
          <div className="w-[1px] h-[1px] mt-[20px]"></div>

          <div className="flex justify-end border-t border-[rgba(0,0,0,0.06)] pt-[20px]">
            <Link href="/collaboration/active" className="btn-accent">
              Start Teaching
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
