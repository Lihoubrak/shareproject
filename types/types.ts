export type Params = {
  params: Promise<{
    slug: string;
  }>;
};
export type PostForm ={
    name: string;
    description: string;
    file_url: string; // Add file_url field
    price: string;
    price_type: "free" | "paid"; // Add price_type field
    category: string; // Only one category can be selected
    tags: string[];
    coverImage: FileList | null;
    file_upload: FileList | null; // Add file_upload field
  }
  export type Project = {
    id: string;
    name: string;
    description: string;
    image_url: string;
    price: string;
    views: number;
    slug: string;
    downloads: number;
    project_tags: Array<{
      tags: {
        id: string;
        name: string;
      };
    }>;
  };
  export type Category = {
    id: string;
    name: string;
  };

  export type BlogCardProps = {
    slug: string;
    title: string;
    image: string;
    description: string;
  };
  // Type Definitions
  export type Profile = {
    id: string;
    username: string;
    avatar_url: string;
    created_at: string;
    last_name: string;
    first_name: string;
    auth_provider: string;
    bio: string;
  };
  
  export type Comment = {
    id: string;
    content: string;
    created_at: string;
    blog_id: string;
    project_id: string;
    user_id: string;
    profiles: Profile;
  };
  
  export type BlogWithTagsAndProfileAndComment = {
    id: string;
    title: string;
    content: string;
    image_url: string;
    created_at: string;
    views: number;
    downloads: number;
    profiles: Profile;
    slug: string;
    blog_tags: {
      tags: {
        id: string;
        name: string;
      };
    }[];
    comments: Comment[];
  };

export type ProjectCardProps = {
  title: string;
  description: string;
  tags: string[];
  buttonText: string;
  image: string;
  price: string;
  views: number;
  downloads: number;
  slug: string;
};
export type ProfileProjectDetail = {
  id: string;
  username: string;
  avatar_url: string;
  created_at: string;
  last_name: string;
  first_name: string;
  auth_provider: string;
  bio: string;
};

export type Rating = {
  id: number;
  rating: number;
  user_id: string;
  comment_id: string;
  created_at: string;
  project_id: string;
};

export type CommentProjectDetail = {
  id: string;
  content: string;
  created_at: string;
  blog_id: string | null;
  project_id: string;
  user_id: string;
  ratings: Rating[];
  profiles: ProfileProjectDetail;
};

export type ProjectDetail = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  price: string;
  views: number;
  slug: string;
  created_at: string;
  downloads: number;
  project_tags: Array<{
    tags: {
      id: string;
      name: string;
    };
  }>;
  profiles: {
    username: string;
    avatar_url: string;
  };
  comments: CommentProjectDetail[];
};

export type ProjectDetailProps = {
  project: ProjectDetail;
};

export type ProfileBlogDetail = {
  id: string;
  username: string;
  avatar_url: string;
  created_at: string;
  last_name: string;
  first_name: string;
  auth_provider: string;
  bio: string;
};

export type CommentBlogDetail = {
  id: string;
  content: string;
  created_at: string;
  blog_id: string;
  project_id: string;
  user_id: string;
  profiles: ProfileBlogDetail;
};

export type RelatedBlog = {
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
  comments: CommentBlogDetail[];
};
export type PostFormBlog  ={
  title: string;
  content: string;
  tags: string[];
  coverImage: FileList | null; // Add cover image field
}
export type PostFormProject= {
  name: string;
  description: string;
  file_url: string; // Add file_url field
  price: string;
  price_type: "free" | "paid"; // Add price_type field
  category: string; // Only one category can be selected
  tags: string[];
  coverImage: FileList | null;
  file_upload: FileList | null; // Add file_upload field
}