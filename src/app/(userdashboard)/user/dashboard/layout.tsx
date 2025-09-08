// app/user/dashboard/layout.tsx
import React, { ReactNode } from "react";
import DashboardLayoutClient from "@/components/DashboardLayoutClient";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <DashboardLayoutClient >
      {children}
    </DashboardLayoutClient>
  );
}
