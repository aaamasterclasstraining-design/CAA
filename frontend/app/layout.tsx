export const metadata = {
  title: 'CAT Operating Portal',
  description: 'Center for Advanced Techniques Operating System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-neutral-50">
        <div className="flex min-h-screen">
          <aside className="fixed left-0 top-0 w-64 h-screen bg-white border-r border-neutral-200 p-6">
            <h2 className="text-lg font-bold text-neutral-900 mb-8">CAT Portal</h2>
            <nav className="space-y-2 text-sm text-neutral-700">
              <a href="/dashboard" className="block hover:text-neutral-900">Dashboard</a>
              <a href="/cases" className="block hover:text-neutral-900">Cases</a>
              <a href="/modules" className="block hover:text-neutral-900">Modules</a>
              <a href="/incidents" className="block hover:text-neutral-900">Incidents</a>
            </nav>
          </aside>
          <main className="ml-64 flex-1 p-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
