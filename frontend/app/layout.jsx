import '../src/index.css';

export const metadata = {
  title: 'Mini Escape',
  description: 'Three-room programming-quiz escape room.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
