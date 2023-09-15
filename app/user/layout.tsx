import { Inter } from "next/font/google";
import Menu from "../components/Menu";
import SearshBar from "../components/SearshBar";
import { Toaster } from "react-hot-toast";

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
        <Toaster position="bottom-right" reverseOrder={false} />
      </div>
      {children}
    </>
  );
}
