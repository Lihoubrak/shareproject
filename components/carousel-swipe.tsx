"use client";

import { useRef, useEffect } from "react";
import Image from "next/legacy/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function CarouselSwipe() {
  const slides = [
    {
      title: "Đại dương xanh cho Doanh nghiệp tăng trưởng bền vững trên Zalo",
      date: "December 31, 2024",
      image:
        "https://topdev.vn/blog/wp-content/uploads/2024/12/1200x628-534x462.jpg",
    },
    {
      title:
        "Lakehouse Architecture: Nền tảng dữ liệu cho ứng dụng AI trong tương lai",
      date: "December 30, 2024",
      image:
        "https://topdev.vn/blog/wp-content/uploads/2024/12/1200x628-534x462.jpg",
    },
    {
      title: "Giải Quyết Bài Toán Kinh Doanh Bằng Big Data và AI",
      date: "November 24, 2024",
      image:
        "https://topdev.vn/blog/wp-content/uploads/2024/12/1200x628-534x462.jpg",
    },
  ];

  const carouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const firstChild = carouselRef.current.firstElementChild;
        if (firstChild) {
          carouselRef.current.appendChild(firstChild); // Move the first slide to the end
        }
      }
    }, 3000); // Auto-slide every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-6xl mx-auto overflow-hidden">
      <div
        ref={carouselRef}
        className="flex w-full transition-transform duration-500"
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-full"
            style={{ minWidth: "100%" }}
          >
            <Card className="relative">
              <Image
                src={slide.image}
                alt={slide.title}
                width={1200} // Adjust based on your needs
                height={300} // Adjust based on your needs
              />
              <CardHeader className="absolute bottom-0 left-0 w-full p-4 bg-black bg-opacity-50 text-white">
                <CardTitle className="text-lg font-bold">
                  {slide.title}
                </CardTitle>
                <CardDescription className="text-sm">
                  {slide.date}
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
