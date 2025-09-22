import "./globals.css";
import { ShopProvider } from "../context/ShopContex"
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Shree Vagheswari Jewellers",
  description: "Official website of Shree Vagheswari Jewellers. Explore our latest collections of gold jewellery",
  icons: {
    icon: "/favicon1.ico",       
    shortcut: "/favicon1.ico", 
  },
  other: {
    "google-site-verification": "QBNV41aAYvaagUju2XiEgLUQQGQn3uUGNynxOEy6EcA",
  },
};


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
