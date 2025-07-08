import type { Metadata } from "next";
import { Cormorant } from "next/font/google";
import "./globals.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";


const cormorant = Cormorant({
  variable: "--font-comorant",
  subsets: ["latin"]
})

export const metadata: Metadata = {
  title: "Jamadi Camp",
  description: "Escapa de la ciudad y sumérgete en la naturaleza. Experimenta aire fresco, fogatas acogedoras y momentos inolvidables en nuestro refugio escénico.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${cormorant.className}`}
      >
        <Navbar/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}
