import { supabase } from "@/lib/client";

export const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    // Query the `auth.users` table to check if the email exists
    const { data, error } = await supabase
      .schema('shareproject')
      .from('profiles') // No need to specify the schema explicitly
      .select('email')
      .eq('email', email)
      .single(); // Ensure only one row is returned
    // If there's an error or no data, return false
    if (error || !data) {
      console.error('Error checking email:', error);
      return false;
    }

    // If data exists, return true
    return true;
  } catch (err) {
    console.error('Unexpected error checking email:', err);
    return false;
  }
};