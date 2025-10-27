///src/features/auth/components/LoginButton.tsx
"use client";
import { useState } from "react";
import LoginModal from "./LoginModal";

export default function LoginButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        className="inline-flex items-center justify-center rounded-lg border border-transparent bg-primary px-4 py-2 text-sm font-semibold text-white shadow-card transition-transform duration-150 hover:-translate-y-0.5 hover:bg-primary-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        onClick={() => setOpen(true)}
      >
        로그인
      </button>
      {open && <LoginModal open={open} onClose={() => setOpen(false)} />}
    </>
  );
}
