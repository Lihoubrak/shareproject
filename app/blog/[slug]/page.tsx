import BlogDetailClient from "@/components/BlogDetailClient";
import { supabase } from "@/lib/supabaseClient";
type Params = {
  params: Promise<{
    slug: string;
  }>;
};
type Profile = {
  id: string;
  username: string;
  avatar_url: string;
  created_at: string;
  last_name: string;
  first_name: string;
  auth_provider: string;
  bio: string;
};

type Comment = {
  id: string;
  content: string;
  created_at: string;
  blog_id: string;
  project_id: string;
  user_id: string;
  profiles: Profile;
};

type RelatedBlog = {
  id: string;
  title: string;
  content: string;
  image_url: string;
  created_at: string;
  views: number;
  profiles: Profile;
  downloads: number;
  slug: string;
  blog_tags: {
    tags: {
      id: string;
      name: string;
    };
  }[];
  comments: Comment[];
};
export async function generateStaticParams() {
  const { data: blogs, error } = await supabase
    .schema("shareproject")
    .from("blogs")
    .select("slug");

  if (error || !blogs) {
    console.error("Error fetching blogs:", error);
    return [];
  }

  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export const dynamicParams = true; // Allow fallback for non-pre-rendered paths
export const revalidate = 60; // Revalidate the page every 60 seconds

export default async function BlogDetail(props: Params) {
  const params = await props.params;
  const { slug } =  params;
  try {
    const decodedSlug = decodeURIComponent(slug);

    // Fetch the current blog with its tags
    const { data: blog, error: blogError } = await supabase
      .schema("shareproject")
      .from("blogs")
      .select(
        `
        *,
        blog_tags(tags(id, name)),
        profiles(*),
        comments(*, profiles(*))
      `
      )
      .eq("slug", decodedSlug)
      .single();
    if (blogError || !blog) {
      console.error("Error fetching blog or blog not found:", blogError);
      return (
        <div>
          <h1>Blog Not Found</h1>
          <p>The blog you are looking for does not exist.</p>
          {blogError && <p>Error: {blogError.message}</p>}
        </div>
      );
    }

    // Extract tag IDs from the current blog
    const tagIds = blog.blog_tags.map(
      ({ tags }: { tags: { id: string; name: string } }) => tags.id
    );
    // Fetch related blogs based on shared tags, excluding the current blog
    const { data: relatedBlogs, error: relatedError } = await supabase
      .schema("shareproject")
      .from("blogs")
      .select(
        `
        *,
        blog_tags(tags(id, name)),
        profiles(*),
        comments(*, profiles(*))
      `
      )
      .in("blog_tags.tags.id", tagIds)
      .neq("id", blog.id) // Exclude the current blog
      .limit(5); // Limit the number of related blogs

    if (relatedError) {
      console.error("Error fetching related blogs:", relatedError);
    }
    return (
      <BlogDetailClient
        blog={blog}
        relatedBlogs={(relatedBlogs as RelatedBlog[]) || []}
      />
    );
  } catch (err) {
    console.error("Unexpected error in BlogDetail component:", err);
    return (
      <div>
        <h1>An Error Occurred</h1>
        <p>
          Sorry, an error occurred while loading the blog. Please try again
          later.
        </p>
      </div>
    );
  }
}
