"use client";
import { useEffect, useState } from "react";

/**
 * In real app:
 * - This comes from JWT / Auth Context
 */
const currentUser = {
  role_id: 1, // 1=Admin, 2=Marketing, 3=Sales
};

/**
 * Role options (ID is the truth)
 */
const ROLE_OPTIONS = [
  { id: 1, name: "Admin" },
  { id: 2, name: "Marketing" },
  { id: 3, name: "Sales" },
];

/**
 * Permission structure (matches DB JSON)
 */
const PERMISSION_GROUPS = {
  "Campaign Management": [
    "campaign_create",
    "campaign_view",
    "campaign_update",
    "campaign_delete",
    "campaign_schedule",
  ],
  "Contact Lists": [
    "contactlist_create",
    "contactlist_view",
    "contactlist_update",
    "contactlist_delete",
  ],
  "Email Templates": [
    "template_create",
    "template_view",
    "template_update",
    "template_delete",
  ],
  "Senders": [
    "sender_create",
    "sender_view",
    "sender_update",
    "sender_delete",
  ],
  "Analytics": ["analytics_view"],
  "Logs": ["logs_view"],
  "Staff & Roles": ["roles_manage"],
};

/**
 * Default permissions (used if DB empty)
 */
const DEFAULT_ROLE_PERMISSIONS = {
  1: Object.fromEntries(
    Object.values(PERMISSION_GROUPS).flat().map((p) => [p, true])
  ),

  2: {
    campaign_create: true,
    campaign_view: true,
    campaign_update: true,
    campaign_schedule: true,
    contactlist_view: true,
    template_create: true,
    template_view: true,
    template_update: true,
    sender_view: true,
    analytics_view: true,
  },

  3: {
    campaign_view: true,
    contactlist_view: true,
    template_view: true,
    sender_view: true,
    analytics_view: true,
  },
};

export default function RolesPage() {
  const [selectedRoleId, setSelectedRoleId] = useState(1);
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(false);

  const isAdmin = currentUser.role_id === 1;

  /*LOAD PERMISSIONS */
  const loadPermissions = async (roleId) => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/roles/${roleId}`
      );

      if (!res.ok) {
        setPermissions(DEFAULT_ROLE_PERMISSIONS[roleId] || {});
      } else {
        const data = await res.json();
        setPermissions(
          Object.keys(data.permissions || {}).length
            ? data.permissions
            : DEFAULT_ROLE_PERMISSIONS[roleId]
        );
      }
    } catch {
      setPermissions(DEFAULT_ROLE_PERMISSIONS[roleId] || {});
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPermissions(selectedRoleId);
  }, [selectedRoleId]);

  /* TOGGLE */
  const togglePermission = (key) => {
    if (!isAdmin) return;
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  /* SAVE  */
  const savePermissions = async () => {
    if (!isAdmin) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/roles/${selectedRoleId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ permissions }),
        }
      );

      if (!res.ok) {
        alert("Failed to save permissions");
        return;
      }

      alert("Permissions updated successfully");
    } catch {
      alert(" Server error");
    }
  };

  /* BLOCK  */
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 font-semibold text-lg">
          Access Denied – Admin Only
        </p>
      </div>
    );
  }

  /*  UI*/
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f6f1db] via-[#cfe1a8] to-[#9caf88] p-8">
      <div className="max-w-4xl mx-auto bg-[#fffdf7] rounded-2xl shadow-2xl p-6">
        <h1 className="text-2xl font-semibold text-[#1f2d16] mb-6">
          Roles & Permissions
        </h1>

        {/* ROLE SELECT */}
        <div className="mb-6 flex items-center gap-4">
          <label className="font-medium">Select Role:</label>
          <select
            value={selectedRoleId}
            onChange={(e) => setSelectedRoleId(Number(e.target.value))}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {/* PERMISSIONS */}
        {loading ? (
          <p>Loading permissions...</p>
        ) : (
          <div className="space-y-6">
            {Object.entries(PERMISSION_GROUPS).map(([group, perms]) => (
              <div key={group}>
                <h2 className="font-semibold text-lg mb-2">{group}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {perms.map((perm) => (
                    <label
                      key={perm}
                      className="flex items-center gap-2 bg-[#f3f7e6] p-2 rounded-lg"
                    >
                      <input
                        type="checkbox"
                        checked={!!permissions[perm]}
                        onChange={() => togglePermission(perm)}
                        className="accent-green-600"
                      />
                      <span className="text-sm">
                        {perm.replaceAll("_", " ")}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SAVE */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={savePermissions}
            className="px-6 py-2 rounded-lg font-medium bg-green-600 hover:bg-green-700 text-white"
          >
            Save Permissions
          </button>
        </div>
      </div>
    </div>
  );
}
