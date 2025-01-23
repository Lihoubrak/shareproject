import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import Image from "next/legacy/image";
import Link from "next/link"; // Import Link component from Next.js
import { stripHtmlTags } from "@/utils/stripHtmlTags";
import { BlogCardProps } from "@/types/types";

export const BlogCard: React.FC<BlogCardProps> = ({
  slug,
  title,
  image,
  description,
}) => (
  <Card className="w-full sm:w-[200px] md:w-[220px] lg:w-[240px] bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden hover:scale-105 transition-all ease-in-out duration-300 flex flex-col">
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

      <CardTitle className="font-semibold text-sm md:text-base text-gray-900 dark:text-gray-100 mb-2 line-clamp-1">
        {title}
      </CardTitle>
      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
        {stripHtmlTags(description)}
      </p>
    </CardContent>

    <CardFooter className="flex flex-wrap justify-between items-center px-3 py-2 h-[50px]">
      {/* Link to the dynamic blog page */}
      <Link href={`/blog/${slug}`}>
        <Button
          variant="outline"
          className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 border-indigo-600 dark:border-indigo-400 text-xs md:text-sm py-1 px-3"
        >
          អានបន្ថែម
        </Button>
      </Link>

      {/* Share Button */}
      <Button className="bg-indigo-600 dark:bg-indigo-700 text-white hover:bg-indigo-700 dark:hover:bg-indigo-800 text-xs md:text-sm py-1 px-3">
        ចែករំលែក
      </Button>
    </CardFooter>
  </Card>
);