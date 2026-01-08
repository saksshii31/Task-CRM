"use client";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: replace with real API later
    setTimeout(() => {
      setProfile({
        name: "Sakshi Patil",
        email: "sakshi@example.com",
        role: "Admin",
        phone: "9876543210",
      });
      setLoading(false);
    }, 500);
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    // TODO: API call
    alert("Profile updated successfully!");
  };

  if (loading) {
    return <p className="text-gray-500">Loading profile...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h1 className="text-2xl font-semibold">My Profile</h1>
        <p className="text-gray-500 mt-1">
          Manage your personal information
        </p>
      </div>

      {/* PROFILE FORM */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-6">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <Input
            label="Full Name"
            name="name"
            value={profile.name}
            onChange={handleChange}
          />

          <Input
            label="Email"
            name="email"
            value={profile.email}
            onChange={handleChange}
          />

          <Input
            label="Role"
            name="role"
            value={profile.role}
            disabled
          />

          <Input
            label="Phone Number"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
          />

        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===== Reusable Input ===== */

function Input({ label, name, value, onChange, disabled = false }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">
        {label}
      </label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`w-full border px-4 py-2 rounded-lg ${
          disabled
            ? "bg-gray-100 text-gray-500"
            : "focus:ring-2 focus:ring-green-500"
        }`}
      />
    </div>
  );
}
