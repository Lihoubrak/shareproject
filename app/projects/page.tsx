'use client'
import ProjectCard from "@/components/project-card";
import { projects } from "@/data";
import React from "react";

export default function ProjectPage() {

  return (
    <div className="flex gap-5 justify-center items-center flex-wrap py-[120px]">
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
