import Menu from "../components/menu";
import SearshBar from "../components/SearshBar";
import { Toaster } from "react-hot-toast";

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
