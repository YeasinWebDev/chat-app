import { Inter } from "next/font/google";
import "../globals.css";
import Provider from "@components/Provider";
import TopBar from "@components/TopBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Chatify",
  description: "A next js Chat App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/assets/logo.svg" type="image/x-icon" />
      </head>
      <body className={inter.className}>
        <Provider>
          <TopBar/>
          {children}
          </Provider>
      </body>
    </html>
  );
}
