import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image"; // Import Image for project images
import Link from "next/link"; // For the project link
import { DollarSign, Eye, Download } from "lucide-react"; // Import lucide-react icons

type ProjectCardProps = {
  title: string;
  description: string;
  tags: string[];
  buttonText: string;
  image: string;
  price: string;
  views: number;
  downloads: number;
};

export default function ProjectCard({
  title,
  description,
  tags,
  buttonText,
  image,
  price,
  views,
  downloads,
}: ProjectCardProps) {
  return (
    <Card className="w-[240px] bg-white shadow-lg rounded-lg overflow-hidden hover:scale-105 transition-all ease-in-out duration-300 flex flex-col">
      <CardContent className="p-0 flex-grow flex flex-col">
        {/* Image for the project */}
        <Image
          src={image}
          alt={title}
          width={300}
          height={160}
          className="rounded-t-md mb-4 object-cover"
        />

        <CardTitle className="font-semibold text-sm text-gray-900 mb-2 px-4 line-clamp-1">
          {title}
        </CardTitle>
        <p className="text-xs text-gray-600 line-clamp-3 px-4 mb-4">{description}</p>

        {/* Project Tags */}
        <div className="flex flex-wrap gap-2 px-4 mb-4">
          {tags.map((tag, index) => (
            <Badge key={index} className="bg-blue-500 text-white text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Icons for Price, Views, and Downloads (Horizontal Layout) */}
        <div className="flex justify-between text-xs text-gray-600 px-4 mb-4">
          <div className="flex items-center gap-1">
            <DollarSign className="text-gray-500" size={16} />
            <span>{price}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="text-gray-500" size={16} />
            <span>{views}</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="text-gray-500" size={16} />
            <span>{downloads}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center px-4 py-2 h-[60px]">
        {/* Link to the project details */}
        <Link href={`/project/${title.replace(/\s+/g, "-").toLowerCase()}`}>
          <Button
            variant="outline"
            className="text-indigo-600 hover:bg-indigo-100 border-indigo-600 text-xs py-1.5 px-3"
           
          >
            {buttonText}
          </Button>
        </Link>
        <Button className="bg-indigo-600 text-white hover:bg-indigo-700 text-xs py-1.5 px-3">
          Share
        </Button>
      </CardFooter>
    </Card>
  );
}
