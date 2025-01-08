import AppHeader from "@/components/app-header"
import { AppSidebar } from "@/components/Sidebar/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import BlogPage from "./blog/page"

export default function Page() {
  return (
    <div className="container mx-auto px-28">
      <div className="flex  gap-5 justify-center items-center flex-wrap">
      <BlogPage/>
      <BlogPage/>
      <BlogPage/>
      <BlogPage/>
      <BlogPage/>
      <BlogPage/>
      <BlogPage/>
      <BlogPage/>
      </div>
      
    </div>
  )
}
