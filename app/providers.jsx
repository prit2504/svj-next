// app/providers.jsx (wraps your app)
"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Loader from "@/components/Loader";

export function Providers({ children }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Trigger loader every time pathname changes
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 500); // small delay to show loader
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {loading && <Loader />}
      {children}
    </>
  );
}
