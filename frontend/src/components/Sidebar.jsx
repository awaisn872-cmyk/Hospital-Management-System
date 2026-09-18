import { LayoutDashboard, Users, Stethoscope, CalendarDays, Receipt, Settings, X } from "lucide-react";

const items = [
  ["dashboard", "Dashboard", LayoutDashboard],
  ["patients", "Patients", Users],
  ["doctors", "Doctors", Stethoscope],
  ["appointments", "Appointments", CalendarDays],
  ["billing", "Billing", Receipt],
  ["settings", "Settings", Settings]
];

export default function Sidebar({ view, setView, open, close }) {
  return (
    <>
      {open && <div className="sidebar-overlay" onClick={close} />}
      <aside className={`sidebar card ${open ? "mobile-open" : ""}`}>
        <div className="sidebar-header">
          <div>
            <div className="logo">HMS</div>
            <div className="muted">Hospital Management System</div>
          </div>
          <button className="mobile-close" onClick={close} aria-label="Close menu"><X size={20}/></button>
        </div>
        <nav className="nav">
          {items.map(([key, label, Icon]) => (
            <button
              key={key}
              className={view === key ? "active" : ""}
              onClick={() => { setView(key); close(); }}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}