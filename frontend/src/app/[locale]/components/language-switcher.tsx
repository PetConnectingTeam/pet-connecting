"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";

export default function LanguageChanger() {
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(`/${e.target.value}/${pathname.split("/").slice(2).join("/")}`);
  };

  return (
    <select
      value={locale}
      onChange={handleChange}
      style={{
        backgroundColor: "gray",
        color: "white",
        padding: "8px",
        borderRadius: "4px",
      }}
    >
      <option value="en">English</option>
      <option value="es">Español</option>
    </select>
  );
}
