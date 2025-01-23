import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { CommentProjectDetail, Rating } from "@/types/types";

export default function useProjectDetail(projectId: string) {
  const [comments, setComments] = useState<CommentProjectDetail[]>([]);
  const [views, setViews] = useState<number>(0);

  // Fetch initial comments and views
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch comments
        const { data: commentsData, error: commentsError } = await supabase
          .schema("shareproject")
          .from("comments")
          .select("*, profiles(*), ratings(*)")
          .eq("project_id", projectId)
          .order("created_at", { ascending: false });

        if (commentsError) throw commentsError;

        setComments(commentsData || []);

        // Fetch views
        const { data: projectData, error: projectError } = await supabase
          .schema("shareproject")
          .from("projects")
          .select("views")
          .eq("id", projectId)
          .single();

        if (projectError) throw projectError;

        setViews(projectData.views || 0);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, [projectId]);

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
          filter: `project_id=eq.${projectId}`,
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

            const newComment: CommentProjectDetail = {
              id: payload.new.id,
              content: payload.new.content,
              created_at: payload.new.created_at,
              blog_id: payload.new.blog_id || null,
              project_id: payload.new.project_id,
              user_id: payload.new.user_id,
              ratings: [],
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
  }, [projectId]);

  // Real-time subscription for ratings
  useEffect(() => {
    const ratingsChannel = supabase
      .channel("ratings")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "shareproject",
          table: "ratings",
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          const newRating = payload.new as Rating;

          setComments((prevComments) =>
            prevComments.map((comment) =>
              comment.id === newRating.comment_id
                ? {
                    ...comment,
                    ratings: [...comment.ratings, newRating],
                  }
                : comment
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ratingsChannel);
    };
  }, [projectId]);

  // Update views
  useEffect(() => {
    const updateViews = async () => {
      try {
        const { error } = await supabase
          .schema("shareproject")
          .from("projects")
          .update({ views: views + 1 })
          .eq("id", projectId);

        if (error) throw error;
      } catch (error) {
        console.error("Error updating views:", error);
      }
    };

    updateViews();
  }, [projectId, views]);

  // Add a new comment
  const addComment = async (comment: string, rating: number, userId: string) => {
    if (!comment.trim()) {
      alert("សូមបញ្ចូលមតិយោបល់មុនពេលបន្ថែម!");
      return;
    }

    try {
      // Insert the comment
      const { data: commentData, error: commentError } = await supabase
        .schema("shareproject")
        .from("comments")
        .insert([{ content: comment, user_id: userId, project_id: projectId }])
        .select()
        .single();

      if (commentError) throw commentError;

      // Insert the rating
      const { error: ratingError } = await supabase
        .schema("shareproject")
        .from("ratings")
        .insert([{ comment_id: commentData.id, user_id: userId, rating, project_id: projectId }]);

      if (ratingError) throw ratingError;

      alert("មតិយោបល់ត្រូវបានបន្ថែមដោយជោគជ័យ!");
    } catch (error) {
      console.error("Error adding comment or rating:", error);
      alert("មានបញ្ហាក្នុងការបន្ថែមមតិយោបល់!");
    }
  };

  return { comments, views, addComment };
}