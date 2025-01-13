"use client";
import React, { useState } from 'react';
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
type Comment = {
  id: number;
  username: string;
  text: string;
  rating: number;
  avatar: string;
};
export default function ProjectDetail() {
  const [comments, setComments] = useState<Comment[]>([
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

  const [formData, setFormData] = useState<{ comment: string; rating: number }>({
    comment: '',
    rating: 5,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddComment = () => {
    if (formData.comment.trim()) {
      const newComment: Comment = {
        id: comments.length + 1,
        username: 'អ្នកប្រើប្រាស់ថ្មី',
        text: formData.comment,
        rating: formData.rating,
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      };
      setComments((prevComments) => [...prevComments, newComment]);
      setFormData({ comment: '', rating: 5 });
    }
  };


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
{/* Comments Section */}
<div className="mt-10">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">មតិយោបល់</h3>

        {/* Add Comment Form */}
        <div className="p-4 border rounded-md shadow-sm">
          <textarea
            name="comment"
            placeholder="មតិយោបល់របស់អ្នក"
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            rows={3}
            value={formData.comment}
            onChange={handleInputChange}
          />
          <div className="flex items-center mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`cursor-pointer w-6 h-6 ${formData.rating >= star ? 'text-yellow-400' : 'text-gray-400'}`}
                onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
              />
            ))}
          </div>
          <Button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={handleAddComment}
          >
            បន្ថែមមតិយោបល់
          </Button>
        </div>

        {/* Display Comments */}
        <div className="mt-6">
          {comments.length === 0 ? (
            <p className="text-gray-600 text-center">សូមទុកមតិយោបល់របស់អ្នក!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="mb-4 p-4 border rounded-md shadow-sm bg-gray-50">
                <div className="flex items-center gap-4">
                  <Image
                    src={comment.avatar}
                    alt={comment.username}
                    width={40}
                    height={40}
                    className="rounded-full border border-gray-300"
                  />
                  <div>
                    <p className="text-gray-800 font-medium">{comment.username}</p>
                  </div>
                </div>
                <p className="mt-2 text-gray-700">{comment.text}</p>
                <div className="flex mt-2">
                  {[...Array(comment.rating)].map((_, index) => (
                    <Star key={index} className="text-yellow-400 w-5 h-5" />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
