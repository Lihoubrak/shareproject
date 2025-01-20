import { v4 as uuidv4 } from "uuid"; 
 // Auto-generate a slug based on the title and a UUID
 export const generateSlug = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // Replace non-alphanumeric characters with hyphens
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
    return `${slug}-${uuidv4().split("-")[0]}`; // Append a short UUID
  };