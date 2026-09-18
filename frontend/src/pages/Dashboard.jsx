import { Users, Stethoscope, CalendarDays, WalletCards } from "lucide-react";

export default function Dashboard({ stats }) {
  const cards = [
    ["Patients", stats.patients, Users],
    ["Doctors", stats.doctors, Stethoscope],
    ["Appointments", stats.appointments, CalendarDays],
    ["Revenue (this session)", stats.revenue, WalletCards]
  ];

  return (
    <div className="card">
      <h3>Quick Overview</h3>
      <div className="stats-grid">
        {cards.map(([label, value, Icon]) => (
          <div className="stat-card card" key={label}>
            <Icon size={20}/>
            <div className="muted">{label}</div>
            <div className="stat-value">{label.includes("Revenue") ? `Rs. ${Number(value || 0).toLocaleString()}` : value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}