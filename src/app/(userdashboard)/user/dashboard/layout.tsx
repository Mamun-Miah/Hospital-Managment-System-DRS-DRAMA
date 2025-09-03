export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <aside>📊 Dashboard Sidebar</aside>
        <section>{children}</section>
      </body>
    </html>
  );
}
