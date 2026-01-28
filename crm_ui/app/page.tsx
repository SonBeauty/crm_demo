"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (token) router.replace("/dashboard");
      else router.replace("/login");
    } catch (e) {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className="text-center">
        <Image
          src="/next.svg"
          alt="logo"
          width={100}
          height={20}
          className="mx-auto dark:invert"
        />
        <p className="mt-4 text-slate-400">Redirecting...</p>
      </div>
    </div>
  );
}
