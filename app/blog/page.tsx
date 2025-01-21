import { BlogCard } from "@/components/blog-card";
import { supabase } from "@/lib/supabaseClient";
import { Metadata } from "next";

export const revalidate = 60; 
export const metadata: Metadata = {
  title: 'ប្លុក - Technology and Programming Blog', 
  description: 'This blog shares articles about technology, programming, and more in both English and Khmer.', // Mixed language description
  keywords: 'technology, programming, blog, IT, development, ប្លុក, Khmer blog',
  openGraph: {
    title: 'ប្លុក - Technology and Programming Blog',
    description: 'Read articles in both Khmer and English on technology, programming, and development.',
    url: 'https://www.example.com',
    images: [
      {
        url: 'https://www.example.com/og-image.jpg',
        width: 800,
        height: 600,
        alt: 'Technology Blog Image',
      },
    ],
  },
};


export default async function BlogPage() {
  const { data: blogPosts, error } = await supabase
    .schema('shareproject')
    .from('blogs')
    .select('*');
  if (error) {
    console.error('Error fetching blog posts:', error);
    return <div>Error loading blog posts.</div>;
  }

  return (
    <div className="flex flex-wrap gap-5 justify-center items-center py-24 px-4 sm:px-6 md:px-8 lg:px-16">
      {blogPosts.map((post) => (
        <BlogCard
          key={post.id} 
          slug={post.slug} 
          title={post.title}
          image={post.image_url} 
          description={post.content} 
        />
      ))}
    </div>
  );
}
