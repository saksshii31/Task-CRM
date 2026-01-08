"use client";
import { useEffect, useState } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

export default function EmailTemplatePage() {
  const [templates, setTemplates] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editorHeight, setEditorHeight] = useState(200);

  const [form, setForm] = useState({
    template_name: "",
    subject: "",
    email_body: "",
  });

  const editor = useEditor({
    extensions: [StarterKit, Link.configure({ openOnClick: false }), Image],
    content: form.email_body || "",
    immediatelyRender: false,
    onUpdate({ editor }) {
      setForm((prev) => ({
        ...prev,
        email_body: editor.getHTML(),
      }));
    },
  });

  const addLink = () => {
    const url = prompt("Enter URL");
    if (url) {
      editor
        ?.chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    }
  };

  const addImage = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        editor?.chain().focus().setImage({ src: reader.result }).run();
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const loadTemplates = async () => {
    const res = await fetch("http://localhost:5000/api/email_templates");
    const data = await res.json();
    setTemplates(data);
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  const resetForm = () => {
    setForm({ template_name: "", subject: "", email_body: "" });
    setEditingId(null);
  };

  const handleSave = async (id) => {
    const url = editingId
      ? `http://localhost:5000/api/email_templates/${editingId}`
      : `http://localhost:5000/api/email_templates`;

    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, created_by: 1 }),
    });

    setOpen(false);
    resetForm();
    loadTemplates();
  };

  //edit
  const handleEdit = async (id) => {
    const res = await fetch(`http://localhost:5000/api/email_templates/${id}`);
    const data = await res.json();
    setForm(data);
    setEditingId(id);
    editor?.commands.setContent(data.email_body || "");
    setOpen(true);
  };

  //delete
  const handleDelete = async (id) => {
    if (!confirm("Delete Template?")) return;
    await fetch(`http://localhost:5000/api/email_templates/${id}`, {
      method: "DELETE",
    });
    loadTemplates();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f6f1db] via-[#cfe1a8] to-[#9caf88] p-8">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* HEADER */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h1 className="text-xl font-semibold">Email Templates</h1>
          <button
            onClick={() => setOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
          >
            Create Template
          </button>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-[#e6efc9]">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold w-1/3">
                  Template Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold w-1/2">
                  Subject
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold w-1/6">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {templates.length === 0 ? (
                <tr>
                  <td colSpan={3} className="text-center py-8 text-gray-500">
                    No templates found
                  </td>
                </tr>
              ) : (
                templates.map((t) => (
                  <tr
                    key={t.id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4 text-sm font-medium">
                      {t.template_name}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {t.subject}
                    </td>

                    <td className="px-6 py-4 text-sm text-center space-x-4">
                      <button
                        onClick={() => handleEdit(t.id)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
                        className="text-red-600 hover:underline"
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
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? "Edit Template" : "Create Template"}
            </h2>

            <input
              className="w-full border px-3 py-2 rounded mb-3"
              placeholder="Template Name"
              value={form.template_name}
              onChange={(e) =>
                setForm({ ...form, template_name: e.target.value })
              }
            />

            <input
              className="w-full border px-3 py-2 rounded mb-3"
              placeholder="Subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />

            {/* TOOLBAR */}
            <div className="flex gap-2 mb-2 flex-wrap">
              <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className="btn"
              >
                Bold
              </button>
              <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className="btn"
              >
                Italic
              </button>
            
              <button onClick={addLink} className="btn">
                Link
              </button>
              <button onClick={addImage} className="btn">
                Image
              </button>
            </div>

            <label className="text-sm text-gray-600 mb-1 block">
              Editor Height
            </label>

            <input
  type="range"
  min={150}
  max={400}
  value={editorHeight}
  onChange={(e) => setEditorHeight(Number(e.target.value))}
  className="w-full accent-green-600 mb-3"
/>

            <div
              className="border rounded p-2 overflow-auto"
              style={{ minHeight: editorHeight }}
            >
              <EditorContent editor={editor} />
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
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

