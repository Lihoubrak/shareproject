import { BlogCard } from "@/components/blog-card";
import { supabase } from "@/lib/supabaseClient";

export const revalidate = 60; 

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
