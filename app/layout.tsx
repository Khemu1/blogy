import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./styles/blogPage.css";
import Nav from "./components/general/Nav";
import Wrapper from "./Wrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blogy",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={""}>
        <Wrapper>
          <Nav />
          {children}
        </Wrapper>
      </body>
    </html>
  );
}
