import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import toast, { Toaster } from "react-hot-toast";
import "./globals.css";
import Header from "./components/header";
import Login from "./components/login";
import Search from "./components/search";
import Footer from "./components/footer";
// import { AppProvider } from "@/context/ContextAPI"
// import { CartProvider } from "@/app/components/cartContext";
import { AppWrapper } from "@/context/ContextAPI"
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"
import NewsLetter from "./components/newsLetter";
import ChatComponent from "./components/chatComponent";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const Mont = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Binsaeed – Fabric of Luxury | Premium Pret, Unstitched, Men, Women, Kids & Perfumes",
  description: "Discover the essence of elegance with M Binsaeed’s Fabric of Luxury collection. Explore premium unstitched & pret suits, men’s formal wear, women’s dresses, kids’ fashion, and signature perfumes.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

const cookiesStore = await cookies()
const token = cookiesStore.get("authToken")?.value;
  return (
    <html lang="en">
      <body
        className={`${Mont.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppWrapper>
          <div className="min-h-screen  flex flex-col justify-between max-w-[1900px] mx-auto">
            <div>
              <Header token={token} />
              <Login />
              <Search />
              <Toaster />
              <main>{children}</main>
            </div>
            
            <div>
              <ChatComponent/>
              <Footer />
            </div>
          </div>
        </AppWrapper>
      </body>
    </html>
  );
}
