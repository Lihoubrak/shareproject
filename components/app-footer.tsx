import { Separator } from "@/components/ui/separator"; // Import ShadCN separator component
import { Button } from "@/components/ui/button"; // Import ShadCN Button component

export default function AppFooter() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-8">
        {/* Top Section */}
        <div className="flex justify-between items-center flex-wrap md:flex-nowrap gap-12">
          {/* Left Section */}
          <div className="flex flex-col items-center md:items-start gap-6">
            <h2 className="text-4xl font-extrabold text-blue-500 leading-tight tracking-wide">
              YourBrand
            </h2>
            <Separator className="w-24 bg-gray-600" />
            <p className="text-lg text-blue-400 mt-2">
              © 2025 All rights reserved
            </p>
          </div>

          {/* Right Section */}
          <div className="flex gap-10 items-center mt-6 md:mt-0">
            <Button
              variant="outline"
              size="lg"
              className="text-blue-500 border-gray-500 hover:bg-blue-700 transition-all duration-300"
            >
              Privacy Policy
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-blue-500 border-gray-500 hover:bg-blue-700 transition-all duration-300"
            >
              Terms of Service
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-blue-500 border-gray-500 hover:bg-blue-700 transition-all duration-300"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </div>

      {/* Footer Divider */}
      <Separator className="mt-12 h-1 bg-gray-700" />

      {/* Footer Bottom */}
      <div className="text-center text-sm py-6 text-blue-400">
        <p>Designed with 💙 by Your Team</p>
      </div>
    </footer>
  );
}
