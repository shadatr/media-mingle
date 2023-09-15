import { Inter } from "next/font/google";
import Menu from "../components/Menu";
import SearshBar from "../components/SearshBar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <>
        <div className="flex">
          <Menu />
          <SearshBar />
        </div>
        {children}
      </>
  );
}
