import type { Metadata } from "next";import "./globals.css";
export const metadata:Metadata={title:"NaijaFlix — Nollywood & More",description:"Stream the best of Nollywood and African cinema."};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}