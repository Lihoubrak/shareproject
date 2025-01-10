'use client'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Star, User } from 'lucide-react'; // Import icons from lucide-react
import React, { useState } from 'react';

export default function ProjectDetail() {
  const [comments, setComments] = useState([
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
  ]);

  return (
    <div className="container mx-auto px-28">
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
        <h1 className="text-4xl font-bold text-center text-gray-800">ឈ្មោះគម្រោង</h1>

        {/* Project Overview */}
        <div className="flex justify-center gap-5">
          <p className="text-lg w-2/3 text-center text-gray-600">
            ពិពណ៌នាខ្លីអំពីគម្រោងនេះ បង្ហាញពីអ្វីដែលវាជា និងគោលបំណងរបស់វា។
          </p>
        </div>

        

        {/* Price and Free/Paid Status */}
        <div className="flex justify-center items-center gap-10">
          <div className="text-xl font-semibold text-gray-700">
            <strong>ស្ថានភាព:</strong> សេរី / បង់ប្រាក់
          </div>
          <div className="text-lg text-gray-600">
            <strong>តម្លៃ:</strong> $X (ប្រសិនបើបង់ប្រាក់)
          </div>
        </div>
{/* Download Button at the Top */}
<div className="flex justify-center">
          <Button className="mt-5 px-6 py-2 bg-blue-600 text-white rounded-md shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            ទាញយកគម្រោង
          </Button>
        </div>
        {/* Installation Instructions */}
        <div className="flex flex-col gap-5">
          <h2 className="text-2xl font-semibold text-gray-800">ការណែនាំក្នុងការដំឡើង</h2>
          <div className="text-lg text-gray-600">
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
          <h2 className="text-2xl font-semibold text-gray-800">លក្ខណៈពិសេស</h2>
          <ul className="list-disc pl-5 text-lg text-gray-600">
            <li>លក្ខណៈពិសេស ១: ពិពណ៌នាលក្ខណៈពិសេស</li>
            <li>លក្ខណៈពិសេស ២: ពិពណ៌នាលក្ខណៈពិសេស</li>
            <li>លក្ខណៈពិសេស ៣: ពិពណ៌នាលក្ខណៈពិសេស</li>
            <li>លក្ខណៈពិសេស ៤: ពិពណ៌នាលក្ខណៈពិសេសថ្មី</li>
            <li>លក្ខណៈពិសេស ៥: ពិពណ៌នាលក្ខណៈពិសេសផ្សេងទៀត</li>
          </ul>
        </div>

        {/* Additional Features */}
        <div className="flex flex-col gap-5">
          <h2 className="text-2xl font-semibold text-gray-800">មុខងារបន្ថែម</h2>
          <ul className="list-disc pl-5 text-lg text-gray-600">
            <li>មុខងារ ១: ពិពណ៌នាមុខងារបន្ថែម</li>
            <li>មុខងារ ២: ពិពណ៌នាមុខងារបន្ថែម</li>
            <li>មុខងារ ៣: ពិពណ៌នាមុខងារបន្ថែម</li>
          </ul>
        </div>

        {/* Demo Image */}
        <div className="flex justify-center">
          <img
            src="your-image-url.jpg"
            alt="Demo Image"
            className="rounded-lg shadow-lg"
            style={{ maxWidth: '80%' }}
          />
        </div>

        {/* Demo Video */}
        <div className="flex justify-center">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/your-video-id"
            title="Demo Video"
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* Comment Section with Rating */}
        <div className="flex flex-col gap-5">
          <h2 className="text-2xl font-semibold text-gray-800">មតិយោបល់</h2>
          {comments.length === 0 ? (
            <p className="text-lg text-gray-600 text-center">សូមទុកមតិយោបល់របស់អ្នក!</p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="p-4 border rounded-md shadow-md">
                  <div className="flex items-center gap-4">
                    <img
                      src={comment.avatar}
                      alt={comment.username}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex flex-col">
                      <strong className="text-gray-700">{comment.username}</strong>
                      <p className="text-gray-600">{comment.text}</p>
                    </div>
                  </div>
                  {/* Rating for Comment */}
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
