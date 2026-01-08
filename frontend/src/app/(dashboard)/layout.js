"use client";

import Link from "next/link";


export default function DashboardLayout({ children }) {
  return (
    
        <div className="min-h-screen flex bg-gradient-to-b from-[#f6f1db] to-[#9caf88]">
          {/* SIDEBAR  */}
          <aside className="w-64 bg-white shadow-xl p-6 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold mb-6 text-[#556b2f]">
                CRM System
              </h2>

              <nav className="space-y-2 text-sm">
                <SidebarLink href="/dashboard">Dashboard</SidebarLink>
                <SidebarLink href="/campaignManagement">Campaigns</SidebarLink>
                <SidebarLink href="/emailTemplates">
                  Email Templates
                </SidebarLink>
                <SidebarLink href="/senders">Senders</SidebarLink>
                <SidebarLink href="/contactLists">Contact Lists</SidebarLink>
                <SidebarLink href="/contacts">Contacts</SidebarLink>
                <SidebarLink href="/staffManagement">Staff</SidebarLink>
                <SidebarLink href="/roles">Permission & Roles</SidebarLink>
              </nav>
            </div>

            <div className="border-t pt-4 space-y-2 text-sm">
              <SidebarLink href="/profile">My Profile</SidebarLink>
              <SidebarLink href="/changePassword">Change Password</SidebarLink>
              <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login";
            }}
            className="w-full text-left text-red-600 hover:underline"
          >
            Logout
          </button>
            </div>
          </aside>

          {/*PAGE CONTEN*/}
          <main className="flex-1 p-8 overflow-auto">{children}</main>
        </div>
  );
}

function SidebarLink({ href, children }) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 rounded-lg text-gray-700 hover:bg-[#eef4d4]"
    >
      {children}
    </Link>
  );
}
