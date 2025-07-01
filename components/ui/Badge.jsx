export default function Badge({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center rounded-full text-sm font-semibold ${className}`}>
      {children}
    </span>
  );
} 