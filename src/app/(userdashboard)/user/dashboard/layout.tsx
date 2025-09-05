// app/user/dashboard/layout.tsx
import { ReactNode } from "react";

import DashboardLayoutClient from "./DashboardLayoutClient";

interface DashboardLayoutProps {
  children: ReactNode;
}


export default function DashboardLayout({ children }: DashboardLayoutProps) {
  

  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
