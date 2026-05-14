import './globals.css';

export const metadata = {
  title: 'Group Adventure',
  description: 'A choose-your-own-adventure voting game',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 min-h-screen flex flex-col items-center">
        <div className="w-full max-w-2xl p-4">{children}</div>
      </body>
    </html>
  );
}