import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function BlogCard() {
  return (
    <Card className="w-[240px] bg-white shadow-sm rounded-lg overflow-hidden hover:scale-105 transition-all ease-in-out duration-300">
  
      <CardContent className="p-0">
        {/* Image for the blog post */}
        <img 
          src="https://topdev.vn/blog/wp-content/uploads/2024/10/gamma-ai-218x150.png" 
          alt="React Hooks" 
          className="w-full h-[150px] object-cover rounded-t-md mb-4"
        />
        <CardTitle className="font-semibold text-sm text-gray-900 mb-2 px-4">
          Learn React Hooks
        </CardTitle>
        <p className="text-xs text-gray-600 line-clamp-3 px-4 mb-4">
          React Hooks are functions that let developers use state and lifecycle features in functional components. This allows for cleaner and more reusable code. In this post, we'll cover some of the most common hooks such as useState, useEffect, and custom hooks.
        </p>
      </CardContent>

      <CardFooter className="flex justify-between items-center px-4 py-2">
        <Button variant="outline" className="text-indigo-600 hover:bg-indigo-100 border-indigo-600 text-xs">Read More</Button>
        <Button className="bg-indigo-600 text-white hover:bg-indigo-700 text-xs">Share</Button>
      </CardFooter>
    </Card>
  )
}
