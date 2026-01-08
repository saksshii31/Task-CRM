"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
    company_name: "",
    phone_number: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Registration failed");
        return;
      }

      alert(data.message);
      router.push("/login");
      setMessage("");
    } catch (err) {
      console.error(err);
      setMessage("Backend server not running");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f6f1db] via-[#cfe1a8] to-[#9caf88] px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center text-[#4b5d3a] mb-6">
          Register
        </h1>

        {message && (
          <p className="text-sm text-red-600 text-center mb-4">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={form.first_name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-[#cbd5b1] focus:outline-none focus:ring-2 focus:ring-[#9caf88] focus:border-transparent text-sm"
          />

          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={form.last_name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-[#cbd5b1] focus:outline-none focus:ring-2 focus:ring-[#9caf88] focus:border-transparent text-sm"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-[#cbd5b1] focus:outline-none focus:ring-2 focus:ring-[#9caf88] focus:border-transparent text-sm"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-[#cbd5b1] focus:outline-none focus:ring-2 focus:ring-[#9caf88] focus:border-transparent text-sm"
          />

          <input
            type="password"
            name="confirm_password"
            placeholder="Confirm Password"
            value={form.confirm_password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-[#cbd5b1] focus:outline-none focus:ring-2 focus:ring-[#9caf88] focus:border-transparent text-sm"
          />

          <input
            type="text"
            name="company_name"
            placeholder="Company Name"
            value={form.company_name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-[#cbd5b1] focus:outline-none focus:ring-2 focus:ring-[#9caf88] focus:border-transparent text-sm"
          />

          <input
            type="tel"
            name="phone_number"
            placeholder="Phone Number"
            value={form.phone_number}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-[#cbd5b1] focus:outline-none focus:ring-2 focus:ring-[#9caf88] focus:border-transparent text-sm"
          />

          <button
            type="submit"
            className="w-full bg-[#7f8f63] hover:bg-[#6d7e55] text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            Register
          </button>

          <p className="text-sm text-center text-gray-600 mt-4">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-[#6d7e55] font-semibold hover:underline"
            >
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
