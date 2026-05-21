/**
 * Nous Logo Component
 * 
 * Renders the Nous platform logo with configurable size.
 * Optimized with Next.js Image component for performance.
 * 
 * Props:
 *   - size: Logo width/height in pixels (default: 40)
 *   - className: Additional CSS classes
 */

import Image from "next/image";

/**
 * @param size - Logo dimension (width and height are equal)
 * @param className - Optional Tailwind/CSS classes for styling
 * @returns SVG logo image component
 */
export function NousLogo({ size = 40, className = "" }: { size?: number; className?: string }) {
  return (
    <Image
      src="/images/logo.png"
      alt="Nous"
      width={size}
      height={size}
      className={className}
      style={{ objectFit: "contain" }}
      priority
    />
  );
}
