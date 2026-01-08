"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";

const userPermissions = {
  campaign_create: true,
  campaign_view: true,
  campaign_update: true,
  campaign_delete: true,
};

const can = (perm) => !!userPermissions[perm];

export default function CampaignManagementPage() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [senders, setSenders] = useState([]);
  const [contactLists, setContactLists] = useState([]);
  const [emailTemplates, setEmailTemplates] = useState([]);

  const [form, setForm] = useState({
    name: "",
    subject: "",
    body: "",
    senders: [],
    recipientLists: [],
    templateId: "",
    scheduleAt: "",
  });

  const loadCampaigns = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/campaigns");
      const data = await res.json();

      setCampaigns(
        Array.isArray(data)
          ? data.map((c) => ({
              id: c.id,
              name: c.campaign_name || c.name,
              subject: c.subject,
              sender: c.sender,
              recipients: c.recipients,
              scheduleAt: c.scheduled_at,
              status: c.status || "Scheduled",
            }))
          : []
      );
    } catch (err) {
      console.error("Load error:", err);
    }
  };

  useEffect(() => {
    loadCampaigns();

    fetch("http://localhost:5000/api/senders")
      .then((res) => res.json())
      .then(setSenders);

    fetch("http://localhost:5000/api/contact_lists")
      .then((res) => res.json())
      .then(setContactLists);

    fetch("http://localhost:5000/api/email_templates")
      .then((res) => res.json())
      .then(setEmailTemplates);
  }, []);

  const editor = useEditor({
  extensions: [StarterKit, Underline],
  content: form.body || "",
  immediatelyRender: false, 
  onUpdate: ({ editor }) => {
    setForm((prev) => ({
      ...prev,
      body: editor.getHTML(),
    }));
  },
});

  
  useEffect(() => {
    if (editor && form.body !== editor.getHTML()) {
      editor.commands.setContent(form.body || "");
    }
  }, [form.body, editor]);

  const handleMultiSelect = (e, field) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setForm((prev) => ({ ...prev, [field]: values }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      subject: "",
      body: "",
      senders: [],
      recipientLists: [],
      templateId: "",
      scheduleAt: "",
    });
    setEditingId(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const formattedDate = form.scheduleAt
        ? form.scheduleAt.replace("T", " ") + ":00"
        : null;

      const payload = {
        campaign_name: form.name,
        subject: form.subject,
        email_body: form.body,
        sender: form.senders.join(","),
        recipients: form.recipientLists.join(","),
        scheduled_at: formattedDate,
        created_by: 1,
      };

      const url = editingId
        ? `http://localhost:5000/api/campaigns/${editingId}`
        : "http://localhost:5000/api/campaigns";

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Save failed");
      }

      setOpen(false);
      resetForm();
      await loadCampaigns();
    } catch (err) {
      console.error(err);
      alert("Failed to save campaign");
    }
  };

  const handleEdit = async (campaign) => {
    const res = await fetch(
      `http://localhost:5000/api/campaigns/${campaign.id}`
    );
    const data = await res.json();

    setForm({
      name: data.campaign_name || "",
      subject: data.subject || "",
      body: data.email_body || "",
      senders: data.sender ? data.sender.split(",") : [],
      recipientLists: data.recipients ? data.recipients.split(",") : [],
      scheduleAt: data.scheduled_at
        ? data.scheduled_at.replace(" ", "T").slice(0, 16)
        : "",
    });

    setEditingId(campaign.id);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this campaign?")) return;

    await fetch(`http://localhost:5000/api/campaigns/${id}`, {
      method: "DELETE",
    });

    loadCampaigns();
  };

  // 🔁 Build lookup maps for display
  const senderMap = {};
  senders.forEach((s) => {
    senderMap[String(s.id)] = s.sender_email;
  });

  const contactListMap = {};
  contactLists.forEach((l) => {
    contactListMap[String(l.id)] = l.list_name;
  });

  const formatSenders = (senderStr) => {
    if (!senderStr) return "—";
    return senderStr
      .split(",")
      .map((id) => senderMap[id] || id)
      .join(", ");
  };

  const formatRecipients = (recipientStr) => {
    if (!recipientStr) return "—";
    return recipientStr
      .split(",")
      .map((id) => contactListMap[id] || id)
      .join(", ");
  };


  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f6f1db] via-[#cfe1a8] to-[#9caf88] p-8">
      <div className="max-w-6xl mx-auto bg-[#fffdf7] rounded-2xl shadow-2xl">
        <div className="px-6 py-4 border-b flex justify-between">
          <h1 className="text-xl font-semibold">Email Campaign Management</h1>

          {can("campaign_create") && (
            <button
              onClick={() => {
                resetForm();
                setOpen(true);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Create Campaign
            </button>
          )}
        </div>

        <table className="w-full text-left">
          <thead className="bg-[#e6efc9]">
            <tr>
              <th className="px-6 py-3">Campaign</th>
              <th className="px-6 py-3">Subject</th>
              <th className="px-6 py-3">Sender</th>
              <th className="px-6 py-3">Recipients</th>
              <th className="px-6 py-3">Schedule</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8">
                  No campaigns found
                </td>
              </tr>
            ) : (
              campaigns.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="px-6 py-3">{c.name}</td>
                  <td className="px-6 py-3">{c.subject}</td>
                  <td className="px-6 py-3">{formatSenders(c.sender)}</td>
                  <td className="px-6 py-3">
                    {formatRecipients(c.recipients)}
                  </td>
                  <td className="px-6 py-3">
                    {c.scheduleAt
                      ? new Date(c.scheduleAt).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "—"}
                  </td>

                  <td className="px-6 py-3">{c.status}</td>
                  <td className="px-6 py-3 space-x-3">
                    <button
                      onClick={() => handleEdit(c)}
                      className="text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-red-600"
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

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-6 shadow-xl">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? "Edit Campaign" : "Create Campaign"}
            </h2>

            <div className="space-y-3">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Campaign Name"
                className="w-full border px-3 py-2 rounded"
              />
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="w-full border px-3 py-2 rounded"
              />

              <select
                className="w-full border px-3 py-2 rounded"
                value={form.templateId || ""}
                onChange={(e) => {
                  const templateId = e.target.value;
                  const template = emailTemplates.find(
                    (t) => String(t.id) === templateId
                  );

                  setForm((prev) => ({
                    ...prev,
                    templateId,
                    subject: template?.subject || prev.subject,
                    body: template?.email_body || prev.body,
                  }));
                }}
              >
                <option value="">Select Email Template</option>
                {emailTemplates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.template_name}
                  </option>
                ))}
              </select>

              <div className="border rounded">
                {/* Toolbar */}
                <div className="flex gap-2 p-2 border-b bg-gray-50">
                  <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                  >
                    <b>B</b>
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                  >
                    <i>I</i>
                  </button>
                  <button
                    onClick={() =>
                      editor.chain().focus().toggleUnderline().run()
                    }
                  >
                    <u>U</u>
                  </button>
                </div>

                {/* Editor */}
                <EditorContent editor={editor} className="p-3 min-h-[150px]" />
              </div>

              <div className="border rounded p-3 max-h-40 overflow-y-auto">
                <p className="font-medium mb-2">Select Sender</p>
                {senders.map((sender) => (
                  <label
                    key={sender.id}
                    className="flex items-center gap-2 py-1"
                  >
                    <input
                      type="checkbox"
                      value={String(sender.id)}
                      checked={form.senders.includes(String(sender.id))}
                      onChange={(e) => {
                        const value = e.target.value;
                        setForm((prev) => ({
                          ...prev,
                          senders: prev.senders.includes(value)
                            ? prev.senders.filter((id) => id !== value)
                            : [...prev.senders, value],
                        }));
                      }}
                    />
                    <span>
                      {sender.sender_name}
                      <span className="text-gray-500 text-sm">
                        {" "}
                        ({sender.sender_email})
                      </span>
                    </span>
                  </label>
                ))}
              </div>

              <div className="border rounded p-3 max-h-40 overflow-y-auto">
                <p className="font-medium mb-2">Select Recipient List</p>
                {contactLists.map((list) => (
                  <label key={list.id} className="flex items-center gap-2 py-1">
                    <input
                      type="checkbox"
                      value={String(list.id)}
                      checked={form.recipientLists.includes(String(list.id))}
                      onChange={(e) => {
                        const value = e.target.value;
                        setForm((prev) => ({
                          ...prev,
                          recipientLists: prev.recipientLists.includes(value)
                            ? prev.recipientLists.filter((id) => id !== value)
                            : [...prev.recipientLists, value],
                        }));
                      }}
                    />
                    <span>{list.list_name}</span>
                  </label>
                ))}
              </div>

              <input
                type="datetime-local"
                name="scheduleAt"
                value={form.scheduleAt}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              />
            </div>

            <div className="flex justify-end gap-3 mt-4">
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
