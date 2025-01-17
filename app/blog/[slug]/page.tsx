import BlogDetailClient from '@/components/BlogDetailClient';
import { supabase } from '@/lib/supabaseClient';

// Define the type for params
type Params = {
  slug: string;
};

// Function to generate static paths
export async function generateStaticParams(): Promise<Params[]> {
  try {
    // Fetch all blog slugs from the 'blogs' table
    const { data: blogs, error } = await supabase
      .schema('shareproject')
      .from('blogs')
      .select('slug');

    // Handle errors
    if (error) {
      return [];
    }

    // Handle case where no blogs are found
    if (!blogs || blogs.length === 0) {
      return [];
    }

    // Return an array of params for static generation
    return blogs.map((blog) => ({
      slug: blog.slug,
    }));
  } catch (err) {
    return [];
  }
}

// Allow fallback for non-pre-rendered paths
export const dynamicParams = true;

// Revalidate the page every 60 seconds
export const revalidate = 60;

// Main Component
export default async function BlogDetail({ params }: { params: Params }) {
  // Validate params
  if (!params || !params.slug) {
    return (
      <div>
        <h1>Invalid Slug</h1>
        <p>The provided slug is invalid or missing.</p>
      </div>
    );
  }

  try {
    // Decode the slug to handle special characters or encoding issues
    const decodedSlug = decodeURIComponent(params.slug);

    // Define the query to fetch blog data with related tags and profiles
    const blogWithTagsAndProfileAndCommentQuery = supabase
      .schema('shareproject')
      .from('blogs')
      .select(`
        *,
        blog_tags(
          tags(id, name)
        ),
        profiles(*)
        comments(*,profiles(*))
      `)
      .eq('slug', decodedSlug)
      .single();

    // Fetch the blog data
    const { data: blog, error } = await blogWithTagsAndProfileAndCommentQuery;
    // Handle errors or missing blog
    if (error || !blog) {
      return (
        <div>
          <h1>Blog Not Found</h1>
          <p>The blog you are looking for does not exist.</p>
          {error && <p>Error: {error.message}</p>}
        </div>
      );
    }

    // Pass the blog data to the Client Component
    return <BlogDetailClient blog={blog} />;
  } catch (err) {
    return (
      <div>
        <h1>An Error Occurred</h1>
        <p>Sorry, an error occurred while loading the blog. Please try again later.</p>
      </div>
    );
  }
}