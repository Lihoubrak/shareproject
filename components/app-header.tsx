'use client';
import { useState } from "react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Menu, ChevronDown } from "lucide-react";
import Image from "next/image";

export default function AppHeader() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSheetToggle = () => {
    setIsSheetOpen(!isSheetOpen);
  };

  return (
    <div className="relative">
      <header className="px-4 md:px-6 lg:px-8 fixed top-0 left-0 right-0 z-50 bg-white shadow-lg border-b">
        <div className="flex items-center justify-between h-20 w-full px-4 md:px-6 lg:px-8">
          {/* Mobile Navigation Trigger */}
          <Sheet open={isSheetOpen} onOpenChange={handleSheetToggle}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden text-gray-700" onClick={handleSheetToggle}>
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="grid gap-4 py-6">
                <Link href="/" className="text-lg font-semibold text-gray-900 hover:text-blue-600">ទំព័រដើម</Link>
                <Link href="/projects" className="text-lg font-semibold text-gray-900 hover:text-blue-600">គម្រោង</Link>
                <Link href="/about" className="text-lg font-semibold text-gray-900 hover:text-blue-600">អំពីយើង</Link>
                <Link href="/contact" className="text-lg font-semibold text-gray-900 hover:text-blue-600">ទំនាក់ទំនង</Link>
                <Link href="/blog" className="text-lg font-semibold text-gray-900 hover:text-blue-600">ប្លុក</Link>
              </div>
            </SheetContent>
          </Sheet>
          
          {/* Logo for Large Screens */}
          <Link href="/" className="mr-6 hidden lg:flex items-center">
            <Image 
              src="/images/IdeaExchange.png"  // Modify with your logo path
              alt="ShareProject"
              className="h-20 w-auto object-contain"  // Increased size for better clarity
              width={160}  // Adjust width for better resolution display
              height={80}  // Adjust height for proper scaling
            />
          </Link>

          {/* Main Navigation Menu */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600 text-lg font-medium">ទំព័រដើម</Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-600 text-lg font-medium">អំពីយើង</Link>
            <Link href="/contact" className="text-gray-700 hover:text-blue-600 text-lg font-medium">ទំនាក់ទំនង</Link>
            <Link href="/blog" className="text-gray-700 hover:text-blue-600 text-lg font-medium">ប្លុក</Link>

            {/* Projects Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="link" className="text-gray-700 hover:text-blue-600 text-lg font-medium flex items-center">
                  គម្រោង
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem>
                  <Link href="/projects" className="text-gray-700 hover:text-blue-600">គម្រោងទាំងអស់</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/projects/category1" className="text-gray-700 hover:text-blue-600">ប្រភេទ 1</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/projects/category2" className="text-gray-700 hover:text-blue-600">ប្រភេទ 2</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* User Authentication Buttons */}
          <div className="ml-20 flex items-center space-x-2">
            <Button className="bg-blue-600 text-white">ចូលប្រើប្រាស់</Button>
          </div>
        </div>
      </header>
    </div>
  );
}
