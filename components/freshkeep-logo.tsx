import type { SVGProps } from 'react'

export function FreshKeepLogo({ className, showWordmark = true, ...props }: SVGProps<SVGSVGElement> & { showWordmark?: boolean }) {
  return (
    <svg
      aria-label={showWordmark ? 'FreshKeep' : 'FreshKeep logo'}
      className={className}
      role="img"
      viewBox={showWordmark ? '0 0 152 40' : '0 0 40 40'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect x="2" y="2" width="36" height="36" rx="10" className="fill-primary" />
      <path d="M11.5 16.5H28.5V27C28.5 29.2091 26.7091 31 24.5 31H15.5C13.2909 31 11.5 29.2091 11.5 27V16.5Z" className="fill-primary-foreground" />
      <path d="M10.5 16.5H29.5" className="stroke-primary-foreground" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M14.5 13H25.5C26.6046 13 27.5 13.8954 27.5 15V16.5H12.5V15C12.5 13.8954 13.3954 13 14.5 13Z" className="fill-primary-foreground" />
      <path d="M15.5 23.5L18.5 26.5L25 19.5" className="stroke-accent" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24.5 31H25.5C27.7091 31 29.5 29.2091 29.5 27V25.5" className="stroke-primary" strokeWidth="1.5" strokeLinecap="round" />
      {showWordmark && <text x="48" y="26" className="fill-foreground" fontFamily="var(--font-sans), sans-serif" fontSize="18" fontWeight="700" letterSpacing="-0.6">FreshKeep</text>}
    </svg>
  )
}
