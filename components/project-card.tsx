import React from "react";
import { Card, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/legacy/image";
import Link from "next/link";
import { DollarSign, Eye, Download } from "lucide-react";
import { stripHtmlTags } from "@/utils/stripHtmlTags";
import { ProjectCardProps } from "@/types/types";

export default function ProjectCard({
  title,
  description,
  tags,
  buttonText,
  image,
  price,
  views,
  downloads,
  slug,
}: ProjectCardProps) {
  return (
    <Card className="w-full sm:w-[200px] md:w-[220px] lg:w-[240px] bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden hover:scale-105 transition-all ease-in-out duration-300 flex flex-col">
      <CardContent className="p-3 sm:p-4 flex-grow flex flex-col">
        {/* Image Section */}
        <div className="relative w-full h-40 mb-3">
          <Image
            src={image}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="rounded-t-md"
            priority
          />
        </div>

        {/* Title and Description */}
        <CardTitle className="font-semibold text-sm md:text-base text-gray-900 dark:text-gray-100 mb-2 line-clamp-1">
          {title}
        </CardTitle>
        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
          {stripHtmlTags(description)}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.slice(0, 2).map((tag, index) => (
            <Badge
              key={index}
              variant="outline"
              className="bg-blue-400 dark:bg-blue-600 text-gray-800 dark:text-gray-100 text-xs rounded-full"
            >
              {tag}
            </Badge>
          ))}
          {tags.length > 2 && (
            <Badge
              variant="outline"
              className="bg-blue-400 dark:bg-blue-600 text-gray-800 dark:text-gray-100 text-xs rounded-full"
            >
              ...
            </Badge>
          )}
        </div>

        {/* Price, Views, and Downloads */}
        <div className="flex flex-wrap justify-between text-xs md:text-sm text-gray-600 dark:text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <DollarSign className="text-gray-500 dark:text-gray-400" size={16} />
            <span>{price}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="text-gray-500 dark:text-gray-400" size={16} />
            <span>{views}</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="text-gray-500 dark:text-gray-400" size={16} />
            <span>{downloads}</span>
          </div>
        </div>
      </CardContent>

      {/* Footer with Buttons */}
      <CardFooter className="flex flex-wrap justify-between items-center px-3 py-2 h-[50px]">
        <Link href={`/projects/${slug}`} passHref>
          <Button
            variant="outline"
            className="text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 border-indigo-600 dark:border-indigo-400 text-xs md:text-sm py-1 px-3"
          >
            {buttonText}
          </Button>
        </Link>

        <Button className="bg-indigo-600 dark:bg-indigo-700 text-white hover:bg-indigo-700 dark:hover:bg-indigo-800 text-xs md:text-sm py-1 px-3">
          ចែករំលែក
        </Button>
      </CardFooter>
    </Card>
  );
}