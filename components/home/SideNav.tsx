'use client';
import { useState, useEffect } from 'react';

const sections = [
  { id: 'hero', label: 'Origin' },
  { id: 'intelligence', label: 'Intelligence' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'showcase', label: 'Live Signals' },
];

export default function SideNav() {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const observers = sections.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.3, rootMargin: '-15% 0px -15% 0px' }
      );
      observer.observe(el);
      return observer;
    });
    return () => observers.forEach(o => o?.disconnect());
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col items-center gap-6 z-50">
      <div className="absolute w-[1px] h-full bg-gradient-to-b from-transparent via-[#0071e3]/40 to-transparent -z-10" />
      {sections.map(({ id, label }) => (
        <NavDot
          key={id}
          active={activeSection === id}
          label={label}
          onClick={() => scrollTo(id)}
        />
      ))}
    </nav>
  );
}

function NavDot({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <div className="group relative flex items-center justify-end">
      <div className="absolute right-7 px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-800 text-xs font-medium text-white opacity-0 translate-x-3 pointer-events-none transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap backdrop-blur-md">
        {label}
      </div>
      <button
        onClick={onClick}
        aria-label={`Scroll to ${label}`}
        className={`w-2.5 h-2.5 rounded-full transition-all duration-500 focus:outline-none ${
          active
            ? 'bg-[#0071e3] opacity-100 scale-125 shadow-[0_0_14px_rgba(0,113,227,0.9)]'
            : 'bg-zinc-600 opacity-40 hover:opacity-70 hover:bg-zinc-400'
        }`}
      />
    </div>
  );
}
