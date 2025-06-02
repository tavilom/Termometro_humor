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
        <div style={{ paddingTop: '70px' }}>
          {children}
        </div>
      </body>
    </html>
  );
}
