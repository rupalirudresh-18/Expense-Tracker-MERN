import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import api from "../api/axios";

export default function Dashboard() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [summary, setSummary] = useState({ total: 0, breakdown: [] });

  useEffect(() => {
    api.get("/expenses/summary", { params: { month } }).then(({ data }) => {
      setSummary(data);
    });
  }, [month]);

  return (
    <div className="page">
      <h2>Dashboard</h2>
      <input
        type="month"
        value={month}
        onChange={(e) => setMonth(e.target.value)}
      />
      <h3>Total spent: ₹{summary.total.toFixed(2)}</h3>

      {summary.breakdown.length === 0 ? (
        <p>No expenses recorded for this month.</p>
      ) : (
        <div className="charts-row">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={summary.breakdown}
                dataKey="total"
                nameKey="name"
                outerRadius={100}
                label={(entry) => entry.name}
              >
                {summary.breakdown.map((entry) => (
                  <Cell key={entry._id} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={summary.breakdown}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total">
                {summary.breakdown.map((entry) => (
                  <Cell key={entry._id} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
