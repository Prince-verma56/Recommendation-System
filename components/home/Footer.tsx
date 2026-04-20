export default function Footer() {
  return (
    <footer className="relative z-10 py-12 border-t border-zinc-800 text-center text-zinc-600 text-sm tracking-wider uppercase">
      <p>© {new Date().getFullYear()} PersonaUI. System active.</p>
    </footer>
  );
}