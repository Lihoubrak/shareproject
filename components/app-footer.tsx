import { Separator } from "@/components/ui/separator"; // Import ShadCN separator component
import Image from "next/legacy/image";
import Link from "next/link";

export default function AppFooter() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-8">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 md:gap-16">
          {/* Left Section */}
          <div className="flex flex-col items-center md:items-start gap-6">
            <Link href="/" className="flex items-center justify-center">
              <Image
                src="/images/IdeaExchange.png" // Modify with your logo path
                alt="ShareProject"
                priority
                className="h-24 object-contain bg-white p-2 "
                width={270} // Adjust width for better resolution display
                height={90} // Adjust height for proper scaling
                layout="intrinsic"
              />
            </Link>

            <Separator className="w-24 bg-gray-600" />

            <p className="text-md text-gray-400 text-center md:text-left">
              © 2025 រក្សាសិទ្ធិគ្រប់យ៉ាង | ធ្វើដោយស្រលាញ់សហគមន៍ខ្មែរ
            </p>
          </div>

          {/* Middle Section */}
          <div className="flex flex-col gap-6 text-gray-300">
            <h3 className="text-lg font-semibold text-white">ទាក់ទង</h3>
            <p className="text-gray-400">អាស័យដ្ឋាន៖ ភ្នំពេញ, កម្ពុជា</p>
            <p className="text-gray-400">អ៊ីមែល៖ info@khmerit.com</p>
            <p className="text-gray-400">លេខទូរស័ព្ទ៖ +855 123 456 789</p>
          </div>

          {/* Right Section */}
          <div className="flex flex-col items-start gap-6">
            <h3 className="text-lg font-semibold text-white">តំណភ្ជាប់លឿន</h3>
            <div className="flex flex-col gap-3">
              <a
                href="#"
                className="text-blue-400 hover:underline hover:text-blue-300 transition duration-300"
              >
                គោលការណ៍ភាពឯកជន
              </a>
              <a
                href="#"
                className="text-blue-400 hover:underline hover:text-blue-300 transition duration-300"
              >
                លក្ខខណ្ឌសេវាកម្ម
              </a>
              <a
                href="#"
                className="text-blue-400 hover:underline hover:text-blue-300 transition duration-300"
              >
                ទំនាក់ទំនង
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Divider */}
      <Separator className="my-8 h-1 bg-gray-700" />

      {/* Footer Bottom */}
      <div className="text-center text-sm text-gray-400">
        <p>
          រចនាដោយ 💙 ក្រុមការងាររបស់អ្នក | ជំរុញការច្នៃប្រឌិតសម្រាប់សហគមន៍ខ្មែរ
        </p>
        <p>
          តាមដានពួកយើង៖{" "}
          <a
            href="#"
            className="text-blue-400 hover:text-blue-300 transition duration-300"
          >
            Facebook
          </a>{" "}
          |{" "}
          <a
            href="#"
            className="text-blue-400 hover:text-blue-300 transition duration-300"
          >
            Twitter
          </a>{" "}
          |{" "}
          <a
            href="#"
            className="text-blue-400 hover:text-blue-300 transition duration-300"
          >
            LinkedIn
          </a>
        </p>
      </div>
    </footer>
  );
}
