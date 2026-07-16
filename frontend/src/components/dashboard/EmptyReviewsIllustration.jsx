export default function EmptyReviewsIllustration({ className = "" }) {
  return (
    <svg
      viewBox="0 0 160 120"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="30" y="14" width="70" height="92" rx="8" className="fill-surface-alt" />
      <rect x="42" y="0" width="46" height="20" rx="6" className="fill-border-light" />
      <rect x="52" y="6" width="26" height="8" rx="3" className="fill-surface" />
      <rect x="42" y="34" width="46" height="6" rx="3" className="fill-border-light" />
      <rect x="42" y="48" width="34" height="6" rx="3" className="fill-border-light" />
      <rect x="42" y="62" width="40" height="6" rx="3" className="fill-border-light" />
      <circle cx="112" cy="78" r="26" className="fill-surface" stroke="currentColor" strokeWidth="3" opacity="0.9" />
      <circle cx="112" cy="78" r="26" className="stroke-accent" fill="none" strokeWidth="3" />
      <line x1="131" y1="97" x2="146" y2="112" className="stroke-accent" strokeWidth="4" strokeLinecap="round" />
      <path
        d="M100 78l8 8 14-16"
        className="stroke-severity-success"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
