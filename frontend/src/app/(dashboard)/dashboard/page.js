"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Dashboard() {
  const [campaignStats, setCampaignStats] = useState([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/dashboard", {
          credentials: "include", //  IMPORTANT (cookie auth)
        });

        const data = await res.json();

        //  always ensure ARRAY
        if (Array.isArray(data)) {
          setCampaignStats(data);
        } else if (Array.isArray(data.stats)) {
          setCampaignStats(data.stats);
        } else {
          setCampaignStats([]);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setCampaignStats([]);
      }
    };

    loadDashboard();
  }, []);

  const role = "Admin";
  const COLORS = ["#86efac", "#fde68a", "#e5e7eb", "#fca5a5"];

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-[#f6f1db] to-[#9caf88]">
      {/*MAIN CONTENT */}
      <main className="flex-1 p-4">
        <div className="w-full mx-auto space-y-8 "  >
          {/* HEADER */}
          <div className="bg-white rounded-2xl shadow p-6">
            <h1 className="text-2xl font-semibold">
              Welcome to CRM Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Manage campaigns, contacts, analytics, and staff from one place
            </p>
          </div>

          {/* QUICK ACTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActionCard
              title="Create Campaign"
              desc="Launch or schedule a new email campaign"
              href="/campaignManagement"
            />
            <ActionCard
              title="View Analytics"
              desc="Track sent, opened & bounced emails"
              href="/campaignAnalytics"
            />
            <ActionCard
              title="Manage Contacts"
              desc="Create and organize contact lists"
              href="/contactLists"
            />
            <ActionCard
              title="Email Templates"
              desc="Design reusable email templates"
              href="/emailTemplates"
            />
            <ActionCard
              title="Senders"
              desc="Manage sender emails"
              href="/senders"
            />
            <ActionCard
              title="Manage Staff"
              desc="Create staff & assign roles"
              href="/staffManagement"
            />
          </div>

          {/*  ANALYTICS DASHBOARD*/}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* BAR CHART */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-semibold mb-4">
                Campaign Status Overview
              </h3>

              {campaignStats.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No campaign data available
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={campaignStats}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#84cc16" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* PIE CHART */}
            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="font-semibold mb-4">
                Campaign Distribution
              </h3>

              {campaignStats.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No campaign data available
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={campaignStats}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label
                    >
                      {campaignStats.map((_, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* COMPONENTS*/

function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-[#eef4d4] transition"
    >
      {children}
    </Link>
  );
}

function ActionCard({ title, desc, href }) {
  return (
    <Link href={href}>
      <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 cursor-pointer">
        <h3 className="font-semibold text-lg">{title}</h3>
        <p className="text-gray-500 text-sm mt-1">{desc}</p>
      </div>
    </Link>
  );
}
