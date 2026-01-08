"use client";
import { useState, useEffect } from "react";


export default function StaffManagement() {
  // states are defined
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    roleId: "",
    status: "Active",
  });

  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [staffList, setStaffList] = useState([]);
  const [saving, setSaving] = useState(false);


  //reset form
  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      roleId: "",
      status: "Active",
    });
    setErrors({});
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  //validation/
  const validate = () => {
    let temp = {};
    if (!form.firstName) temp.firstName = "First Name Required";
    if (!form.lastName) temp.lastName = "Last Name Required";
    if (!form.email) temp.email = "Email Required";
    if (!form.phone) temp.phone = "Phone Required";
    if (!form.roleId) temp.roleId = "Role Required";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // Convert role_id → role name 
  const getRoleName = (id) => {
    if (id === 1) return "Admin";
    if (id === 2) return "Sales";
    if (id === 3) return "Marketing";
    return "-";
  };

  // edit function
  const handleEdit = (staff) => {
    setForm({
      firstName: staff.first_name,
      lastName: staff.last_name,
      email: staff.email,
      phone: staff.phone,
      roleId: staff.role_id,
      status: staff.status,
    });
    setEditingId(staff.id);
    setOpen(true);
  };

  //save function
  const handleSave = async () => {
    if (!validate()) return;

    if (saving) return; 
    setSaving(true);

    const payload = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      role: Number(form.roleId), // convert to number
      status: form.status.toLowerCase(),
    };

    console.log(" Sending payload:", payload);

    try {
      let response;
      if (editingId) {
        response = await fetch(`http://localhost:5000/api/staff/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        response = await fetch(`http://localhost:5000/api/staff`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid server response");
      }
      if (!response.ok) {
        alert(`Error: ${data.error || "Failed to save staff"}`);
        return;
      }

      setOpen(false);
      setEditingId(null);
      resetForm();
      loadStaff();
      setSaving(false);
    } catch (error) {
      console.error("Save error:", error);
      alert(`Error: ${error.message}`);
    }
  };

  //delete function
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this staff?")) return;

    await fetch(`http://localhost:5000/api/staff/${id}`, {
      method: "DELETE",
    });

    loadStaff();
  };

  const loadStaff = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/staff");
      const data = await res.json();
      setStaffList(data);
    } catch (err) {
      console.error("Failed to load staff:", err);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadStaff();
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f6f1db] via-[#cfe1a8] to-[#9caf88] p-6">
      <div className="w-full max-w-6xl bg-[#fffdf7] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#cfe1a8] space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-[#1f2d16]">
              Staff Management
            </h2>

            <button
              onClick={() => {
                resetForm();
                setEditingId(null);
                setOpen(true);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium shadow"
            >
              Add Staff
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex gap-3 flex-wrap">
            <input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-[220px] px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <table className="w-full text-left">
          <thead className="bg-[#e6efc9] text-[#2b3a1f]">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#e2ebc7]">
            {staffList.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">
                  No staff records found.
                </td>
              </tr>
            ) : (
              staffList
                .filter((staff) => {
                  const fullName =
                    `${staff.first_name} ${staff.last_name}`.toLowerCase();
                  return (
                    (fullName.includes(search.toLowerCase()) ||
                      staff.email
                        .toLowerCase()
                        .includes(search.toLowerCase())) &&
                    (roleFilter === "All" ||
                      getRoleName(staff.role_id) === roleFilter) &&
                    (statusFilter === "All" || staff.status === statusFilter)
                  );
                })
                .map((staff) => (
                  <tr key={staff.id} className="hover:bg-[#f3f7e6] transition">
                    <td className="px-6 py-4 font-medium">
                      {staff.first_name} {staff.last_name}
                    </td>
                    <td className="px-6 py-4">{staff.email}</td>
                    <td className="px-6 py-4">{staff.phone}</td>
                    <td>{getRoleName(staff.role_id)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          staff.status === "Active"
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {staff.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 space-x-4">
                      <button
                        onClick={() => handleEdit(staff)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(staff.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-[#fffdf7] w-full max-w-md rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-4">
              {editingId ? "Edit Staff" : "Add Staff"}
            </h2>

            <div className="space-y-3">
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />

              <select
                name="roleId"
                value={form.roleId}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select Role</option>
                <option value="1">Admin</option>
                <option value="2">Sales</option>
                <option value="3">Marketing</option>
              </select>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setOpen(false);
                  setEditingId(null);
                  resetForm();
                }}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className={`px-4 py-2 rounded ${
                  saving ? "bg-gray-400" : "bg-green-600"
                }`}
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

//modal is pop-up page!
