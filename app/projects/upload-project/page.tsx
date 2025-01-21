import { supabase } from "@/lib/supabaseClient";

import "./style.scss";
import { Metadata } from "next";
import UploadProject from "./_components/UploadProject";

export const metadata: Metadata = {
  title: "Upload Your Project - Khmer Community Platform",
  description:
    "Share your projects, ideas, and experiences with the Khmer community. Upload your project and inspire others.",
  openGraph: {
    title: "Upload Your Project - Khmer Community Platform",
    description:
      "A platform where you can upload and share your projects with the Khmer community.",
    url: "https://yourwebsite.com/upload-project", // Replace with your actual URL for the project upload page
    images: [
      {
        url: "https://yourwebsite.com/images/upload-project-image.jpg", // Replace with an appropriate image URL
        width: 800,
        height: 600,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Upload Your Project - Khmer Community Platform",
    description:
      "Join the Khmer community and upload your projects to share your work and knowledge.",
    images: ["https://yourwebsite.com/images/upload-project-image.jpg"], // Replace with an appropriate image URL
  },
};

// Enable dynamic parameters for non-pre-rendered paths
export const dynamicParams = true;

// Revalidate the page every 60 seconds (ISR)
export const revalidate = 60;

// Fetch technologies directly in the Server Component
async function fetchTags() {
  try {
    // Fetch technologies from the `technologies` table
    const { data, error } = await supabase
      .schema("shareproject") 
      .from("tags") 
      .select("name"); 

    if (error) {
      throw error;
    }

    // Extract technology names from the response
    return data.map((tag) => tag.name);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return []; // Return an empty array if there's an error
  }
}

export default async function ProjectEditPage() {
  // Fetch tags directly in the Server Component
  const tags = await fetchTags();

  return (
    <div className="flex flex-wrap gap-5 justify-center items-center py-24 px-4 sm:px-6 md:px-8 lg:px-16">
      <UploadProject tags={tags} /> 
    </div>
  );
}