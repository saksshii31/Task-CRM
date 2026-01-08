"use client";

import { useEffect, useState } from "react";

function StatusBadge({ status }) {
  const colors = {
    Sent: "bg-green-100 text-green-700",
    Scheduled: "bg-yellow-100 text-yellow-700",
    Draft: "bg-gray-200 text-gray-700",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        colors[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

export default function CampaignAnalytics() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/campaigns");
        const data = await res.json();

        //  API already returns correct sender emails
        setCampaigns(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN");
  };
  const [senders, setSenders] = useState([]);
  const senderMap = {};
  senders.forEach((s) => {
    senderMap[String(s.id)] = s.sender_email;
  });

  const formatSenders = (senderStr) => {
    if (!senderStr) return "—";
    return senderStr
      .split(",")
      .map((id) => senderMap[id] || id)
      .join(", ");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f6f1db] via-[#cfe1a8] to-[#9caf88] p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h1 className="text-2xl font-semibold">Campaign Analytics</h1>
          <p className="text-gray-500 mt-1">
            All campaigns fetched directly from Campaign Management
          </p>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="p-4 text-left">Campaign</th>
                <th className="p-4 text-left">Sender</th>
                <th className="p-4 text-left">Recipients</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Scheduled Date</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-400">
                    Loading campaigns...
                  </td>
                </tr>
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-gray-400">
                    No campaigns found
                  </td>
                </tr>
              ) : (
                campaigns.map((c) => (
                  <tr key={c.id} className="border-t">
                    {/* Campaign Name */}
                    <td className="p-4 font-medium">{c.campaign_name}</td>

                    {/* SENDER EMAILS (STRING) */}
                    <td className="p-4 text-sm">{formatSenders(c.sender)}</td>

                    {/* Recipients */}
                    <td className="p-4">{c.recipients || "-"}</td>

                    {/* Status */}
                    <td className="p-4 text-center">
                      <StatusBadge status={c.status} />
                    </td>

                    {/* Date */}
                    <td className="p-4 text-center text-gray-600">
                      {formatDate(c.scheduled_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
