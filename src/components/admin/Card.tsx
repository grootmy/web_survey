import { ReactNode } from 'react';

interface CardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`card ${className}`}>
      <div className="border-b border-border p-4">
        <h3 className="font-semibold text-text">{title}</h3>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}
