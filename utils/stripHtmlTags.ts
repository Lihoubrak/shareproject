export const stripHtmlTags = (html: string): string => {
    return html.replace(/<[^>]*>?/gm, ""); // Remove all HTML tags
  };
  