import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export const metadata: Metadata = {
  title: "Smart Inventory Management System | DBMS Level 3 Project",
  description: "PES University DBMS Experiential Learning Project - Autonomous Smart Inventory with PostgreSQL, pgvector & Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 min-h-screen">
        <div className="flex">
          <Sidebar />
          <div className="flex-1 ml-64 flex flex-col min-h-screen">
            <Header />
            <main className="p-8 flex-1">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
