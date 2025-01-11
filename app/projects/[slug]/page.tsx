import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import Image from 'next/image';

export default function ProjectDetail() {
  const comments = [
    {
      id: 1,
      username: 'អ្នកប្រើប្រាស់ ១',
      text: 'គម្រោងអស្ចារ្យណាស់! លក្ខណៈពិសេសគឺអស្ចារ្យ ហើយវាងាយស្រួលប្រើ។',
      rating: 5,
      avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    {
      id: 2,
      username: 'អ្នកប្រើប្រាស់ ២',
      text: 'ខ្ញុំបានស្រួលក្នុងការដំឡើង ប៉ុន្តែវាគួរត្រូវធ្វើការងារ។',
      rating: 4,
      avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-28">
      <div className="flex flex-col gap-10 py-[120px]">
        {/* Breadcrumb Navigation */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">ទំព័រដើម</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/projects">គម្រោង</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>របៀបសាងសង់កម្មវិធី</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Project Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800">
          ឈ្មោះគម្រោង
        </h1>

        {/* Project Overview */}
        <div className="flex justify-center gap-5">
          <p className="text-base sm:text-lg w-full sm:w-2/3 text-center text-gray-600">
            ពិពណ៌នាខ្លីអំពីគម្រោងនេះ បង្ហាញពីអ្វីដែលវាជា និងគោលបំណងរបស់វា។
          </p>
        </div>

        {/* Price and Free/Paid Status */}
        <div className="flex justify-center items-center gap-10 flex-wrap">
          <div className="text-lg sm:text-xl font-semibold text-gray-700">
            <strong>ស្ថានភាព:</strong> សេរី / បង់ប្រាក់
          </div>
          <div className="text-base sm:text-lg text-gray-600">
            <strong>តម្លៃ:</strong> $X (ប្រសិនបើបង់ប្រាក់)
          </div>
        </div>

        {/* Download Button */}
        <div className="flex justify-center">
          <Button className="mt-5 px-6 py-2 bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            ទាញយកគម្រោង
          </Button>
        </div>

        {/* Installation Instructions */}
        <div className="flex flex-col gap-5">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">ការណែនាំក្នុងការដំឡើង</h2>
          <div className="text-base sm:text-lg text-gray-600">
            <ol className="list-decimal pl-5">
              <li>ជំហានទី ១: ដំឡើងសារពើភ័ណ្ឌ</li>
              <li>ជំហានទី ២: គូសសារឯកសារ</li>
              <li>ជំហានទី ៣: ប្រើប្រាស់គម្រោងក្នុងកុំព្យូទ័ររបស់អ្នក</li>
              <li>ជំហានទី ៤: កំណត់អថិជនបរិស្ថាន</li>
            </ol>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-col gap-5">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">លក្ខណៈពិសេស</h2>
          <ul className="list-disc pl-5 text-base sm:text-lg text-gray-600">
            <li>លក្ខណៈពិសេស ១: ពិពណ៌នាលក្ខណៈពិសេស</li>
            <li>លក្ខណៈពិសេស ២: ពិពណ៌នាលក្ខណៈពិសេស</li>
            <li>លក្ខណៈពិសេស ៣: ពិពណ៌នាលក្ខណៈពិសេស</li>
          </ul>
        </div>

        {/* Demo Image */}
        <div className="flex justify-center">
          <Image
            src="/path-to-image.jpg"
            alt="Demo"
            width={800}
            height={600}
            className="rounded-lg shadow-lg"
          />
        </div>

        {/* Comment Section */}
        <div className="flex flex-col gap-5">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">មតិយោបល់</h2>
          {comments.length === 0 ? (
            <p className="text-base sm:text-lg text-gray-600 text-center">សូមទុកមតិយោបល់របស់អ្នក!</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="p-4 border rounded-md shadow-md">
                  <div className="flex items-center gap-4">
                    <Image
                      src={comment.avatar}
                      alt={comment.username}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <div className="flex flex-col">
                      <strong className="text-gray-700">{comment.username}</strong>
                      <p className="text-gray-600">{comment.text}</p>
                    </div>
                  </div>
                  <div className="flex mt-2">
                    {[...Array(comment.rating)].map((_, index) => (
                      <Star key={index} className="text-yellow-400 w-5 h-5" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
