import React, { useEffect } from "react";
import { Card, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { DollarSign, Eye, Download } from "lucide-react";

// Define the expected structure of the Facebook SDK response
type FacebookShareResponse = {
  error_message?: string;
};

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

declare global {
  interface Window {
    FB?: {
      init: (config: { appId: string; xfbml: boolean; version: string }) => void;
      ui: (options: { method: string; href: string }, callback: (response: FacebookShareResponse) => void) => void;
    };
  }
}

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
  useEffect(() => {
    if (typeof window !== "undefined" && !window.FB) {
      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v12.0";
      script.async = true;
      script.onload = () => {
        window.FB?.init({
          appId: "3586504731647127",
          xfbml: true,
          version: "v12.0",
        });
      };
      document.body.appendChild(script);
    }
  }, []);

  const shareToFacebook = (url: string) => {
    if (typeof window !== "undefined" && window.FB) {
      window.FB.ui(
        {
          method: "share",
          href: url,
        },
        (response: FacebookShareResponse) => {
          if (response && !response.error_message) {
            console.log("Successfully shared!");
          } else {
            console.log("Error while sharing.");
          }
        }
      );
    }
  };

  return (
    <Card className="w-full sm:w-[200px] md:w-[220px] lg:w-[240px] bg-white shadow-lg rounded-lg overflow-hidden hover:scale-105 transition-all ease-in-out duration-300 flex flex-col">
      <CardContent className="p-3 sm:p-4 flex-grow flex flex-col">
        {/* Image Section */}
        <div className="relative w-full h-40 mb-3">
          <Image
            src={image}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="rounded-t-md"
          />
        </div>

        {/* Title and Description */}
        <CardTitle className="font-semibold text-sm md:text-base text-gray-900 mb-2 line-clamp-1">
          {title}
        </CardTitle>
        <p className="text-xs md:text-sm text-gray-600 line-clamp-2 mb-3">{description}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="bg-blue-400 text-gray-800 text-xs rounded-full">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Price, Views, and Downloads */}
        <div className="flex flex-wrap justify-between text-xs md:text-sm text-gray-600 mb-3">
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

      {/* Footer with Buttons */}
      <CardFooter className="flex flex-wrap justify-between items-center px-3 py-2 h-[50px]">
        <Link href={`/projects/${title.replace(/\s+/g, "-").toLowerCase()}`}>
          <Button
            variant="outline"
            className="text-indigo-600 hover:bg-indigo-100 border-indigo-600 text-xs md:text-sm py-1 px-3"
          >
            {buttonText}
          </Button>
        </Link>

        <Button
          className="bg-indigo-600 text-white hover:bg-indigo-700 text-xs md:text-sm py-1 px-3"
          onClick={() =>
            shareToFacebook(`https://ideaexchangekh.netlify.app/projects/${title.replace(/\s+/g, "-").toLowerCase()}`)
          }
        >
          ចែករំលែក
        </Button>
      </CardFooter>
    </Card>
  );
}
