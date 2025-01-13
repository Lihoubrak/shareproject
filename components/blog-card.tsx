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
  <Card className="w-full sm:w-[200px] md:w-[220px] lg:w-[240px] bg-white shadow-lg rounded-lg overflow-hidden hover:scale-105 transition-all ease-in-out duration-300 flex flex-col">
    <CardContent className="p-3 sm:p-4 flex-grow flex flex-col">
      {/* Image for the blog post */}
      <div className="relative w-full h-40 mb-3">
        <Image
          src={image}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="rounded-t-md"
        />
      </div>

      <CardTitle className="font-semibold text-sm md:text-base text-gray-900 mb-2 line-clamp-1">
        {title}
      </CardTitle>
      <p className="text-xs md:text-sm text-gray-600 line-clamp-2 mb-3">{description}</p>
    </CardContent>

    <CardFooter className="flex flex-wrap justify-between items-center px-3 py-2 h-[50px]">
      {/* Link to the dynamic blog page */}
      <Link href={`/blog/${slug.replace(/\s+/g, "-").toLowerCase()}`}>
        <Button
          variant="outline"
          className="text-indigo-600 hover:bg-indigo-100 border-indigo-600 text-xs md:text-sm py-1 px-3"
        >
          អានបន្ថែម
        </Button>
      </Link>
      
      {/* Share Button */}
      <Button className="bg-indigo-600 text-white hover:bg-indigo-700 text-xs md:text-sm py-1 px-3">
        ចែករំលែក
      </Button>
    </CardFooter>
  </Card>
);
