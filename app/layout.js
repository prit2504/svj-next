import "./globals.css";
import { ShopProvider } from "../context/ShopContex"
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar/>
        <ShopProvider>
          {children}
        </ShopProvider>
        <Footer/>
      </body>
    </html>
  );
}
