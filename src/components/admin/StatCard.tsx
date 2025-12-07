interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: string;
}

export function StatCard({ title, value, change, icon }: StatCardProps) {
  const isPositive = change.startsWith('+');

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted">{title}</p>
          <p className="text-2xl font-bold text-text mt-1">{value}</p>
          <p className={`text-sm mt-1 ${isPositive ? 'text-success' : 'text-danger'}`}>
            {change}
          </p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
    </div>
  );
}
