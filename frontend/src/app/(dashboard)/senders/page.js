"use client";
import { useEffect, useState } from "react";

export default function SenderManagementPage() {
  const [senders, setSenders] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    sender_name: "",
    sender_email: "",
  });

  const loadSenders = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/senders", {
        cache: "no-store",
      });

      if (!res.ok) {
        console.error("GET senders failed");
        setSenders([]);
        return;
      }

      const data = await res.json();
      setSenders(data);
    } catch (err) {
      console.error("LOAD SENDERS ERROR:", err);
      setSenders([]);
    }
  };

  useEffect(() => {
    loadSenders();
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/senders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_name: form.sender_name.trim(),
          sender_email: form.sender_email.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Unable to save sender");
        return;
      }

      setOpen(false);
      setForm({ sender_name: "", sender_email: "" });
      loadSenders();
    } catch {
      alert("Backend not responding");
    }
  };

  //edit
  const handleEdit = (sender) => {
    setForm({
      sender_name: sender.sender_name,
      sender_email: sender.sender_email,
    });
    setEditingId(sender.id);
    setOpen(true);
  };

  //delete
  const handleDelete = async (id) => {
    if (!confirm("Delete this sender?")) return;
    await fetch(`http://localhost:5000/api/senders/${id}`, {
      method: "DELETE",
    });
    loadSenders();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f6f1db] via-[#cfe1a8] to-[#9caf88] p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl">
        <div className="px-6 py-4 border-b flex justify-between">
          <h1 className="text-xl font-semibold">Sender Management</h1>
          <button
            onClick={() => setOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add Sender
          </button>
        </div>

        <table className="w-full">
          <thead className="bg-[#e6efc9]">
            <tr>
              <th className="px-6 py-3 text-left">Sender Name</th>
              <th className="px-6 py-3 text-left">Sender Email</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {senders.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="px-6 py-3">{s.sender_name}</td>
                <td className="px-6 py-3">{s.sender_email}</td>
                <td className="px-6 py-3 text-center space-x-3">
                  <button
                    onClick={() => handleEdit(s)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? "Edit Sender" : "Add Sender"}
            </h2>

            <input
              className="w-full border px-3 py-2 rounded mb-3"
              placeholder="Sender Name"
              value={form.sender_name}
              onChange={(e) =>
                setForm({ ...form, sender_name: e.target.value })
              }
            />

            <input
              className="w-full border px-3 py-2 rounded mb-3"
              placeholder="Sender Email"
              value={form.sender_email}
              onChange={(e) =>
                setForm({ ...form, sender_email: e.target.value })
              }
            />

            <div className="flex justify-end gap-3">
              <button onClick={() => setOpen(false)}>Cancel</button>
              <button
                onClick={handleSave}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
