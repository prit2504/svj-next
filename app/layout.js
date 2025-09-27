// import "./globals.css";
// import { ShopProvider } from "../context/ShopContex"
// import Navbar from "@/components/Navbar";
// import Footer from "@/components/Footer";

// export const metadata = {
//   title: "Shree Vagheswari Jewellers",
//   description: "Official website of Shree Vagheswari Jewellers. Explore our latest collections of gold jewellery",
//   icons: {
//     icon: "/favicon.ico",       
//     shortcut: "/favicon1.ico", 
//   },
//   other: {
//     "google-site-verification": "QBNV41aAYvaagUju2XiEgLUQQGQn3uUGNynxOEy6EcA",
//   },
// };


// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body>
//         <Navbar/>
//         <ShopProvider>
//           {children}
//         </ShopProvider>
//         <Footer/>
//       </body>
//     </html>
//   );
// }


import "./globals.css";
import { ShopProvider } from "../context/ShopContex";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: {
    default: "Shree Vagheswari Jewellers",
    template: "%s | Shree Vagheswari Jewellers",
  },
  description:
    "Official website of Shree Vagheswari Jewellers. Explore our handcrafted jewellery collections, blending tradition and modern design for every special occasion.",
  icons: {
    icon: "/favicon.ico", 
    shortcut: "/favicon.ico",
  },
  other: {
    "google-site-verification":
      "QBNV41aAYvaagUju2XiEgLUQQGQn3uUGNynxOEy6EcA",
  },
  openGraph: {
    title: "Shree Vagheswari Jewellers",
    description:
      "Official website of Shree Vagheswari Jewellers. Explore our handcrafted jewellery collections, blending tradition and modern design for every special occasion.",
    url: "https://www.shreevagheswarijewellers.com/", 
    siteName: "Shree Vagheswari Jewellers",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta
          name="application-name"
          content="Shree Vagheswari Jewellers"
        />
        <meta
          name="apple-mobile-web-app-title"
          content="Shree Vagheswari Jewellers"
        />

        <meta
          name="description"
          content="Official website of Shree Vagheswari Jewellers. Explore our handcrafted jewellery collections, blending tradition and modern design for every special occasion."
        />

        <link rel="icon" href="/favicon.ico" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Shree Vagheswari Jewellers",
              url: "https://www.shreevagheswarijewellers.com/",
            }),
          }}
        />
      </head>
      <body>
        <Navbar />
        <ShopProvider>{children}</ShopProvider>
        <Footer />
      </body>
    </html>
  );
}
