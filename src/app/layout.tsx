// src/app/layout.tsx
import "../styles/globals.css";
import Providers from "./providers";
import RootShell from "@/components/layout/RootShell";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('theme');if(t==='dark')document.documentElement.classList.add('dark');else if(t==='light')document.documentElement.classList.remove('dark')}catch{}`,
          }}
        />
      </head>
      <body className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark transition-colors duration-300">
        <Providers>
          <RootShell>
            {children}
          </RootShell>
        </Providers>
      </body>
    </html>
  );
}
