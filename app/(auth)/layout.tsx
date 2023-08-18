// import { ClerkProvider } from "@clerk/nextjs";
// import { Inter } from "next/font/google";

// import "../globals.css";

// export const metadata = {
//   title: "hooter",
//   description: "A simple clone to twitter/threads ",
// };

// const inter = Inter({ subsets: ["latin"] });

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <ClerkProvider>
//       <html lang="en">
//         <body className={`${inter.className} bg-dark-1`}>{children}</body>
//       </html>
//     </ClerkProvider>
//   );
// }

// app/layout.tsx
import "../globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Hooter",
  description: "A twitter clone",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
