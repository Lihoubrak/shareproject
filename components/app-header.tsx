"use client";
import { useState } from "react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Menu, ChevronDown } from "lucide-react";
import Image from "next/legacy/image";
import ThemeSwitcher from "./shared/ThemeSwitcher";
import { Category } from "@/types/types";
import { useAuth } from "@/contexts/AuthContext";
export default function AppHeader({ categories }: { categories: Category[] }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const handleSheetToggle = () => {
    setIsSheetOpen(!isSheetOpen);
  };

  // Close sheet when navigating to a new page
  const handleLinkClick = () => {
    setIsSheetOpen(false);
    setIsDropdownOpen(false); // Close the dropdown menu when navigating
  };

  return (
    <div className="relative">
     <header className="px-4 md:px-6 lg:px-8 fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 text-black dark:text-white shadow-lg border-b transition-colors duration-300">
        <div className="flex items-center justify-between h-20 w-full px-4 md:px-6 lg:px-8">
          {/* Mobile Navigation Trigger */}
          <Sheet open={isSheetOpen} onOpenChange={handleSheetToggle}>
  <SheetTrigger asChild>
    <Button
      variant="outline"
      size="icon"
      className="lg:hidden text-gray-700 dark:text-gray-300"
      onClick={handleSheetToggle}
    >
      <Menu className="h-6 w-6" />
      <span className="sr-only">Toggle navigation menu</span>
    </Button>
  </SheetTrigger>
  <SheetContent side="left" className="bg-white dark:bg-gray-900">
    <div className="grid gap-4 py-6">
      <Link
        href="/"
        className="text-lg font-semibold text-gray-900 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
        onClick={handleLinkClick}
      >
        ទំព័រដើម
      </Link>
      <Link
        href="/projects"
        className="text-lg font-semibold text-gray-900 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
        onClick={handleLinkClick}
      >
        គម្រោង
      </Link>
      <Link
        href="/about"
        className="text-lg font-semibold text-gray-900 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
        onClick={handleLinkClick}
      >
        អំពីយើង
      </Link>
      <Link
        href="/contact"
        className="text-lg font-semibold text-gray-900 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
        onClick={handleLinkClick}
      >
        ទំនាក់ទំនង
      </Link>
      <Link
        href="/blog"
        className="text-lg font-semibold text-gray-900 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
        onClick={handleLinkClick}
      >
        ប្លុក
      </Link>
    </div>
  </SheetContent>
</Sheet>

          {/* Logo for Large Screens */}
          <Link href="/" className="mr-6 hidden lg:flex items-center">
            <Image
              src="/images/IdeaExchange.png" // Path to the image file
              alt="ShareProject" // Alternative text for accessibility
              priority // Indicates that this image should be preloaded
               className="h-20 w-auto object-contain dark:filter dark:invert"
              width={238} // Natural width of the image
              height={160} // Natural height of the image
              layout="intrinsic"
            />
          </Link>

          {/* Main Navigation Menu */}
          <div className="hidden lg:flex items-center space-x-6">
  <Link
    href="/"
    className="text-lg font-medium text-gray-900 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
    onClick={handleLinkClick}
  >
    ទំព័រដើម
  </Link>
  <Link
    href="/about"
    className="text-lg font-medium text-gray-900 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
    onClick={handleLinkClick}
  >
    អំពីយើង
  </Link>
  <Link
    href="/contact"
    className="text-lg font-medium text-gray-900 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
    onClick={handleLinkClick}
  >
    ទំនាក់ទំនង
  </Link>
  <Link
    href="/blog"
    className="text-lg font-medium text-gray-900 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
    onClick={handleLinkClick}
  >
    ប្លុក
  </Link>

  {/* Projects Dropdown */}
  <DropdownMenu
    open={isDropdownOpen}
    onOpenChange={setIsDropdownOpen}
  >
    <DropdownMenuTrigger asChild>
      <Button
        variant="link"
        className={`text-lg font-medium text-gray-900 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 flex items-center ${isDropdownOpen ? "border-b" : ""}`}
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        គម្រោង
        <ChevronDown className="ml-1 h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start">
      <DropdownMenuItem>
        <Link
          href="/projects"
          className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
          onClick={handleLinkClick}
        >
          គម្រោងទាំងអស់
        </Link>
      </DropdownMenuItem>
      {/* Dynamically render categories */}
      {categories.map((category) => (
        <DropdownMenuItem key={category.id}>
          <Link
            href={{
              pathname: "/projects",
              query: { category: category.name },
            }}
            className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            onClick={handleLinkClick}
          >
            {category.name}
          </Link>
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
</div>
<ThemeSwitcher/>
          {/* User Authentication Buttons */}
          <div className="ml-20 flex items-center space-x-2">
            {!isAuthenticated ? (
              // Display login button if the user is not authenticated
              <Link href="/login">
                <Button className="bg-blue-600 text-white">
                  ចូលប្រើប្រាស់
                </Button>
              </Link>
            ) : (
              // Display upload project and write blog buttons if authenticated
              <>
                <Link href="/projects/upload-project">
                  <Button className="bg-green-600 text-white">
                    បញ្ចូលគម្រោង
                  </Button>
                </Link>
                <Link href="/blog/write-blog">
                  <Button className="bg-yellow-600 text-white">
                    សរសេរប្លុក
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
