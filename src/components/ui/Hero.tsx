// src/app/ui/Hero.tsx
export default function Hero({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="bg-card rounded-2xl shadow-sm border border-default overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-sky-500 text-white p-7 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight m-0">{title}</h1>
        {subtitle && (
          <p className="mt-1 opacity-90">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
