'use client'

interface CardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  className?: string;
}

export default function AdminCard({ title, value, icon, className = '' }: CardProps) {
  return (
    <div className={`bg-white rounded-xl shadow p-6 ${className}`}>
      <div className="flex items-center mb-2">
        {icon && <div className="mr-3">{icon}</div>}
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  )
}
