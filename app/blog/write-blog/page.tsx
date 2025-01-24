
import { supabase } from "@/lib/client";
import EditForm from "./_components/EditForm";
import "./style.scss";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Write Your Blog - Khmer Community Platform",
  description:
    "Share your ideas, experiences, and projects with the Khmer community. Write your blog and inspire others.",
  openGraph: {
    title: "Write Your Blog - Khmer Community Platform",
    description:
      "A platform where you can write blogs and share your experiences with the Khmer community.",
    url: "https://yourwebsite.com/write", // Replace with your actual URL for the blog writing page
    images: [
      {
        url: "https://yourwebsite.com/images/write-blog-image.jpg", // Replace with an appropriate image URL
        width: 800,
        height: 600,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Write Your Blog - Khmer Community Platform",
    description:
      "Join the Khmer community and write blogs to share your thoughts, experiences, and knowledge.",
    images: ["https://yourwebsite.com/images/write-blog-image.jpg"], // Replace with an appropriate image URL
  },
};

// Enable dynamic parameters for non-pre-rendered paths
export const dynamicParams = true;

// Revalidate the page every 60 seconds (ISR)
export const revalidate = 60;

// Fetch tags directly in the Server Component
async function fetchTags() {
  try {
    // Fetch tags from the `tags` table
    const { data, error } = await supabase
      .schema("shareproject") // Replace with your schema name
      .from("tags")
      .select("name"); // Fetch only the `name` column

    if (error) {
      throw error;
    }

    // Extract tag names from the response
    return data.map((tag) => tag.name);
  } catch (error) {
    console.error("Error fetching tags:", error);
    return []; // Return an empty array if there's an error
  }
}

export default async function EditPage() {
  // Fetch tags directly in the Server Component
  const tags = await fetchTags();

  return (
    <div className="flex flex-wrap gap-5 justify-center items-center py-24 px-4 sm:px-6 md:px-8 lg:px-16">
      <EditForm tags={tags} />
    </div>
  );
}