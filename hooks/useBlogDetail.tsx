import { useEffect, useState } from "react";
import { Comment } from "@/types/types";
import { supabase } from "@/lib/client";

export default function useBlogDetail(blogId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [views, setViews] = useState<number>(0);

  // Fetch initial comments and views
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch comments
        const { data: commentsData, error: commentsError } = await supabase
          .schema("shareproject")
          .from("comments")
          .select("*, profiles(*)")
          .eq("blog_id", blogId)
          .order("created_at", { ascending: false });

        if (commentsError) throw commentsError;

        setComments(commentsData || []);

        // Fetch views
        const { data: blogData, error: blogError } = await supabase
          .schema("shareproject")
          .from("blogs")
          .select("views")
          .eq("id", blogId)
          .single();

        if (blogError) throw blogError;

        setViews(blogData.views || 0);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, [blogId]);

  // Real-time subscription for comments
  useEffect(() => {
    const commentsChannel = supabase
      .channel("comments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "shareproject",
          table: "comments",
          filter: `blog_id=eq.${blogId}`,
        },
        async (payload) => {
          try {
            const { data: profileData, error: profileError } = await supabase
              .schema("shareproject")
              .from("profiles")
              .select("*")
              .eq("id", payload.new.user_id)
              .single();

            if (profileError) throw profileError;

            const newComment: Comment = {
              id: payload.new.id,
              content: payload.new.content,
              created_at: payload.new.created_at,
              blog_id: payload.new.blog_id,
              project_id: payload.new.project_id || "",
              user_id: payload.new.user_id,
              profiles: profileData,
            };

            setComments((prevComments) => [newComment, ...prevComments]);
          } catch (error) {
            console.error("Error fetching profile data:", error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(commentsChannel);
    };
  }, [blogId]);

  // Update views
  useEffect(() => {
    const updateViews = async () => {
      try {
        const { error } = await supabase
          .schema("shareproject")
          .from("blogs")
          .update({ views: views + 1 })
          .eq("id", blogId);

        if (error) throw error;
      } catch (error) {
        console.error("Error updating views:", error);
      }
    };

    updateViews();
  }, [blogId, views]);

  // Add a new comment
  const addComment = async (comment: string, userId: string) => {
    if (!comment.trim()) {
      alert("សូមបញ្ចូលមតិយោបល់មុនពេលបន្ថែម!");
      return;
    }

    try {
      const { error } = await supabase
        .schema("shareproject")
        .from("comments")
        .insert([{ content: comment, user_id: userId, blog_id: blogId }]);

      if (error) throw error;

      alert("មតិយោបល់ត្រូវបានបន្ថែមដោយជោគជ័យ!");
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("មានបញ្ហាក្នុងការបន្ថែមមតិយោបល់!");
    }
  };

  return { comments, views, addComment };
}