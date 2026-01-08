"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
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
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // important for auth cookie
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Login failed");
        return;
      }

      alert(data.message);
      router.push("/dashboard");
      setMessage("");
    } catch (err) {
      console.error(err);
      setMessage("Backend server not running");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f6f1db] via-[#cfe1a8] to-[#9caf88] px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold text-center text-[#4b5d3a] mb-4">
          Login
        </h1>

        {message && (
          <p className="text-sm text-red-600 text-center mb-2">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <a
            href="/forgetPassword"
            className="text-sm text-[#7f8f63] hover:text-[#5f6f45] hover:underline font-medium text-right block mt-0 leading-none"
          >
            Forget password?
          </a>

          <button
            type="submit"
            className="w-full mt-2 bg-[#7f8f63] hover:bg-[#6d7e55] text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            Login
          </button>

          <p className="text-sm text-center text-gray-600 mt-4">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-[#6d7e55] font-semibold hover:underline"
            >
              Register
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
