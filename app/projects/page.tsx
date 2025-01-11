'use client'
import ProjectCard from "@/components/project-card";
import { projects } from "@/data";
import React from "react";

export default function ProjectPage() {

  return (
    <div className="flex flex-wrap gap-5 justify-center items-center py-24 px-4 sm:px-6 md:px-8 lg:px-16">
      {projects.map((project, index) => (
        <ProjectCard
          key={index}
          title={project.title}
          description={project.description}
          tags={project.tags}
          buttonText={project.buttonText}
          image={project.image}  // Pass the image
          price={project.price}   // Pass the price
          views={project.views}   // Pass the views
          downloads={project.downloads}  // Pass the downloads
        />
      ))}
    </div>
  );
}
