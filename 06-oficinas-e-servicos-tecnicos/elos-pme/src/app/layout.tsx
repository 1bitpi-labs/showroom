import "./globals.css";
export const metadata = {
  title: "Brisa Oficina | Orçamentos e serviços",
  description: "Demonstração fictícia do portal ElosPME",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
