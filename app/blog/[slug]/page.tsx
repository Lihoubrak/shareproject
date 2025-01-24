import BlogDetailClient from "@/components/BlogDetailClient";
import { supabase } from "@/lib/client";
import { Params, RelatedBlog } from "@/types/types";


// Generate Static Params
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

// Generate Metadata for the Blog
export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  try {
    const decodedSlug = decodeURIComponent(slug);

    const { data: blog, error: blogError } = await supabase
      .schema("shareproject")
      .from("blogs")
      .select(
        `*, profiles(*), blog_tags(tags(id, name))`
      )
      .eq("slug", decodedSlug)
      .single();

    if (blogError || !blog) {
      return {
        title: "Blog Not Found",
        description: "The blog you are looking for does not exist.",
      };
    }

    return {
      title: blog.title,
      description: blog.content.substring(0, 160), // First 160 characters for description
      openGraph: {
        title: blog.title,
        description: blog.content.substring(0, 160),
        url: `https://yourwebsite.com/blog/${blog.slug}`,
        images: [
          {
            url: blog.image_url,
            width: 800,
            height: 600,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: blog.title,
        description: blog.content.substring(0, 160),
        images: [blog.image_url],
      },
    };
  } catch (err) {
    console.error("Error fetching blog for metadata:", err);
    return {
      title: "Error Loading Blog",
      description: "An error occurred while loading the blog.",
    };
  }
}

export default async function BlogDetail(props: Params) {
  const params = await props.params;
  const { slug } = params;
  try {
    const decodedSlug = decodeURIComponent(slug);

    // Fetch the current blog with its tags
    const { data: blog, error: blogError } = await supabase
      .schema("shareproject")
      .from("blogs")
      .select(
        `*, blog_tags(tags(id, name)), profiles(*), comments(*, profiles(*))`
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
        `*, blog_tags(tags(id, name)), profiles(*), comments(*, profiles(*))`
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
