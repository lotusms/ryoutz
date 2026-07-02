export default function ConnectLayout({ children }) {
  return (
    <div className="relative min-h-dvh bg-slate-950 text-site-fg">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-linear-to-b from-blue-950/25 via-slate-950 to-slate-950"
      />
      {children}
    </div>
  );
}
