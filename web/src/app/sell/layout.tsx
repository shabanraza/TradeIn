import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sell Your Phone - Get Best Price',
  description: 'Sell your old phone and get the best price. Safe, secure, and hassle-free process.',
  robots: 'no-cache, no-store, must-revalidate',
  other: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
};

export default function SellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}


