import Navbar from '../components/Navbar';

export const metadata = {
  title: 'Termômetro de Humor',
  description: 'Acompanhe como você está se sentindo!',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
