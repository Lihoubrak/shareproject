import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link"; // Import Link component from Next.js

// Define a type for the component's props
type BlogCardProps = {
  slug: string;
  title: string;
  image: string;
  description: string;
};

export const BlogCard: React.FC<BlogCardProps> = ({
  slug,
  title,
  image,
  description,
}) => (
  <Card className="w-[240px] bg-white shadow-sm rounded-lg overflow-hidden hover:scale-105 transition-all ease-in-out duration-300">
    <CardContent className="p-0">
      {/* Image for the blog post */}
      <Image
        src={image}
        alt={title}
        width={300}
        height={150}
        className="rounded-t-md mb-4 object-cover"
      />

      <CardTitle className="font-semibold text-sm text-gray-900 mb-2 px-4 line-clamp-1 ">
        {title}
      </CardTitle>
      <p className="text-xs text-gray-600 line-clamp-3 px-4 mb-4">
        {description}
      </p>
    </CardContent>

    <CardFooter className="flex justify-between items-center px-4 py-2">
      {/* Link to the dynamic blog page */}
      <Link  href={`/blog/${slug.replace(/\s+/g, "-").toLowerCase()}`}>
        <Button
          variant="outline"
          className="text-indigo-600 hover:bg-indigo-100 border-indigo-600 text-xs"
        >
          Read More
        </Button>
      </Link>
      <Button className="bg-indigo-600 text-white hover:bg-indigo-700 text-xs">
        Share
      </Button>
    </CardFooter>
  </Card>
);
