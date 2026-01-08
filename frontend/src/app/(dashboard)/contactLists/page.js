"use client";

import { useEffect, useState } from "react";

const userPermissions = {
  contactlist_create: true,
  contactlist_view: true,
  contactlist_update: true,
  contactlist_delete: true,
};

const can = (perm) => !!userPermissions[perm];

export default function ContactListPage() {
  const [lists, setLists] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    list_name: "",
    description: "",
    contacts: [],
  });

  const loadLists = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/contact_lists");
      const data = await res.json();

      setLists(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Load lists error:", err);
      setLists([]);
    }
  };

  const loadContacts = async () => {
    const res = await fetch("http://localhost:5000/api/contacts");
    const data = await res.json();
    setContacts(data || []);
  };

  useEffect(() => {
    loadLists();
    loadContacts();
  }, []);

  const resetForm = () => {
    setForm({
      list_name: "",
      description: "",
      contacts: [],
    });
    setEditingId(null);
  };

  const toggleContact = (id) => {
    setForm((prev) => ({
      ...prev,
      contacts: prev.contacts.includes(id)
        ? prev.contacts.filter((c) => c !== id)
        : [...prev.contacts, id],
    }));
  };

  //save
  const handleSave = async () => {
    try {
      const payload = {
        list_name: form.list_name,
        description: form.description,
        contacts: form.contacts,
        created_by: 1,
      };

      const url = editingId
        ? `http://localhost:5000/api/contact_lists/${editingId}`
        : `http://localhost:5000/api/contact_lists`;

      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
      }

      alert(" Contact list saved successfully");

      setOpen(false);
      resetForm();
      loadLists();
    } catch (err) {
      console.error("SAVE ERROR:", err);
      alert(" Failed to save contact list");
    }
  };

  //edit
  const handleEdit = async (list) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/contact_lists/${list.id}`
      );

      if (!res.ok) throw new Error("Failed to load list");

      const data = await res.json();

      setForm({
        list_name: data.list_name,
        description: data.description || "",
        contacts: data.contacts || [],
      });

      setEditingId(list.id);
      setOpen(true);
    } catch (err) {
      console.error(err);
      alert("Failed to open edit modal");
    }
  };

  //delete
  const handleDelete = async (id) => {
    if (!confirm("Delete this contact list?")) return;

    await fetch(`http://localhost:5000/api/contact_lists/${id}`, {
      method: "DELETE",
    });

    loadLists();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f6f1db] via-[#cfe1a8] to-[#9caf88] p-8">
      <div className="max-w-5xl mx-auto bg-[#fffdf7] rounded-2xl shadow-2xl">
        {/* HEADER */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h1 className="text-xl font-semibold">Contact List Management</h1>

          {can("contactlist_create") && (
            <button
              onClick={() => {
                resetForm();
                setOpen(true);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Create Contact List
            </button>
          )}
        </div>

        {/* TABLE */}
        <table className="w-full text-left">
          <thead className="bg-[#e6efc9]">
            <tr>
              <th className="px-6 py-3">List Name</th>
              <th className="px-6 py-3">Description</th>
              <th className="px-6 py-3">Total Contacts</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {lists.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8">
                  No contact lists found
                </td>
              </tr>
            ) : (
              lists.map((l) => (
                <tr key={l.id} className="border-t">
                  <td className="px-6 py-3 font-medium">{l.list_name}</td>
                  <td className="px-6 py-3">{l.description}</td>
                  <td className="px-6 py-3">{l.total_contacts}</td>
                  <td className="px-6 py-3 space-x-3">
                    {can("contactlist_update") && (
                      <button
                        onClick={() => handleEdit(l)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                    )}
                    {can("contactlist_delete") && (
                      <button
                        onClick={() => handleDelete(l.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-xl p-6 shadow-xl">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? "Edit Contact List" : "Create Contact List"}
            </h2>

            <div className="space-y-3">
              <input
                value={form.list_name}
                onChange={(e) =>
                  setForm({ ...form, list_name: e.target.value })
                }
                placeholder="List Name"
                className="w-full border px-3 py-2 rounded"
              />

              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Description"
                className="w-full border px-3 py-2 rounded"
              />

              <div className="border rounded p-3 max-h-40 overflow-y-auto">
                <p className="font-medium mb-2">Select Contacts</p>

                {contacts.length === 0 && (
                  <p className="text-sm text-gray-500">No contacts available</p>
                )}

                {contacts.map((c) => (
                  <label
                    key={c.id}
                    className="flex items-center gap-2 text-sm mb-1"
                  >
                    <input
                      type="checkbox"
                      checked={form.contacts.includes(c.id)}
                      onChange={() => toggleContact(c.id)}
                    />
                    {c.name} ({c.email})
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-green-600 text-white rounded"
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
