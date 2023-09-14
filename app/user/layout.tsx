import { Inter } from "next/font/google";
import Menu from "../components/Menu";
import SearshBar from "../components/SearshBar";
import ToggleMenu from "../components/toggle/Toggle-menu";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex">
          <Menu />
          <SearshBar />
        </div>
        {children}
      </body>
    </html>
  );
}
