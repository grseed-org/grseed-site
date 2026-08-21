import type {Metadata} from 'next';

// Global stylesheet (Tailwind v4). Imported by the frontend route group's root
// layout, so the Payload admin route group keeps its own styling untouched.
import '@/styles.css';

export const metadata: Metadata = {
  icons: {icon: '/logo-out-mini.jpg'},
};

export default function FrontendRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-hans">
      <head>
        {/* boxicons font used across the marketing components. */}
        <link
          rel="stylesheet"
          href="https://cdn.bootcdn.net/ajax/libs/boxicons/2.1.4/css/boxicons.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
