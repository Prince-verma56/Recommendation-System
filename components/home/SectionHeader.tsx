export default function SectionHeader({ title, subtitle, align = 'center' }: { title: string; subtitle: string; align?: 'left' | 'center' }) {
  return (
    <div className={`mb-12 ${align === 'center' ? 'text-center' : 'text-left'}`}>
      <h2 className="text-4xl font-bold tracking-tight md:text-5xl mb-6">{title}</h2>
      <p className="text-zinc-400 max-w-2xl text-xl font-light leading-relaxed mx-auto" style={{ marginLeft: align === 'center' ? 'auto' : '0' }}>{subtitle}</p>
    </div>
  );
}