import type { Metadata } from "next";
import "./globals.scss";
import AppHeader from "@/components/app-header";
import AppFooter from "@/components/app-footer";
import { Category } from "@/types/types";
import { supabase } from "@/lib/client";

export const metadata: Metadata = {
  title: "Welcome to the IdeaexchangeKH", 
  description:
    "A platform where the Khmer community can share blogs, projects, and ideas for free. Join us and make an impact!", 
  openGraph: {
    title: "IdeaexchangeKH",
    description:
      "A platform for the Khmer community to share blogs, projects, and ideas freely.",
    url: "https://yourwebsite.com", // Replace with your actual homepage URL
    images: [
      {
        url: "https://yourwebsite.com/images/homepage-image.jpg", // Add your image URL here
        width: 800,
        height: 600,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "IdeaexchangeKH",
    description:
      "A platform where the Khmer community can share blogs, projects, and ideas for free.",
    images: ["https://yourwebsite.com/images/homepage-image.jpg"], // Add your Twitter card image URL here
  },
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch categories from Supabase
  const { data: categories, error } = await supabase
    .schema("shareproject")
    .from("categories")
    .select("*");

  // Handle errors
  if (error) {
    console.error("Error fetching categories:", error);
    return <div>Error loading categories.</div>;
  }

  return (
    <html lang="en">
      <head>
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Import Chenla font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Angkor&family=Battambang:wght@100;300;400;700;900&family=Bokor&family=Chenla&family=Content:wght@400;700&family=Dangrek&family=Fasthand&family=Kantumruy+Pro:ital,wght@0,100..700;1,100..700&family=Kdam+Thmor+Pro&family=Koulen&family=Moul&family=Moulpali&family=Nokora:wght@100;300;400;700;900&family=Noto+Serif+Khmer:wght@100..900&family=Odor+Mean+Chey&family=Suwannaphum:wght@100;300;400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {/* Pass categories to AppHeader */}
        <AppHeader categories={categories as Category[]} />
        <main>{children}</main>
        <AppFooter />
      </body>
    </html>
  );
}