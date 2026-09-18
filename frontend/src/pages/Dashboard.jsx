import {
  Users,
  Stethoscope,
  CalendarDays,
  WalletCards
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

export default function Dashboard({ stats }) {
  const cards = [
    ["Patients", stats.patients, Users],
    ["Doctors", stats.doctors, Stethoscope],
    ["Appointments", stats.appointments, CalendarDays],
    ["Revenue", stats.revenue, WalletCards]
  ];

  const patientGrowth = stats.patientGrowth || [];
  const appointmentStats = stats.appointmentStats || [];
  const revenueStats = stats.revenueStats || [];
  const genderStats = stats.genderStats || [];

  return (
    <div className="dashboard-page">

      {/* QUICK OVERVIEW */}
      <div className="dashboard-section">
        <div className="section-heading">
          <div>
            <h3>Quick Overview</h3>
            <p>Hospital performance at a glance</p>
          </div>
        </div>

        <div className="stats-grid">
          {cards.map(([label, value, Icon]) => (
            <div className="stat-card card" key={label}>
              <div className="stat-icon">
                <Icon size={20} />
              </div>

              <div className="muted">{label}</div>

              <div className="stat-value">
                {label === "Revenue"
                  ? `Rs. ${Number(value || 0).toLocaleString()}`
                  : Number(value || 0).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FIRST ROW */}
      <div className="charts-grid">

        {/* PATIENT GROWTH */}
        <div className="chart-card card">
          <div className="chart-header">
            <div>
              <h3>Patient Growth</h3>
              <p>New patients registered over time</p>
            </div>
          </div>

          <div className="chart-container">
            {patientGrowth.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={patientGrowth}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="month" />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="count"
                    name="Patients"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="no-chart-data">
                No patient data available yet
              </div>
            )}
          </div>
        </div>

        {/* APPOINTMENTS */}
        <div className="chart-card card">
          <div className="chart-header">
            <div>
              <h3>Appointments</h3>
              <p>Monthly appointment activity</p>
            </div>
          </div>

          <div className="chart-container">
            {appointmentStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={appointmentStats}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="month" />

                  <YAxis allowDecimals={false} />

                  <Tooltip />

                  <Bar
                    dataKey="count"
                    name="Appointments"
                    fill="#0ea5e9"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="no-chart-data">
                No appointment data available yet
              </div>
            )}
          </div>
        </div>

      </div>

      {/* SECOND ROW */}
      <div className="charts-grid">

        {/* REVENUE */}
        <div className="chart-card card">
          <div className="chart-header">
            <div>
              <h3>Revenue Analytics</h3>
              <p>Monthly paid invoice revenue</p>
            </div>
          </div>

          <div className="chart-container">
            {revenueStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueStats}>
                  <defs>
                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#8b5cf6"
                        stopOpacity={0.3}
                      />

                      <stop
                        offset="95%"
                        stopColor="#8b5cf6"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="month" />

                  <YAxis />

                  <Tooltip
                    formatter={(value) =>
                      `Rs. ${Number(value).toLocaleString()}`
                    }
                  />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="no-chart-data">
                No revenue data available yet
              </div>
            )}
          </div>
        </div>

        {/* GENDER */}
        <div className="chart-card card">
          <div className="chart-header">
            <div>
              <h3>Patient Demographics</h3>
              <p>Patient gender distribution</p>
            </div>
          </div>

          <div className="chart-container pie-container">
            {genderStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderStats}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={95}
                    innerRadius={55}
                    paddingAngle={3}
                  >
                    {genderStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          ["#10b981", "#0ea5e9", "#8b5cf6"][index % 3]
                        }
                      />
                    ))}
                  </Pie>

                  <Tooltip />

                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="no-chart-data">
                No gender data available yet
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}