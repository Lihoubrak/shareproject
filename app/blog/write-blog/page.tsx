"use client";

import EditForm from "./_components/EditForm";

import "./style.scss";

export default function EditPage() {
  return (
    <div className="flex flex-wrap gap-5 justify-center items-center py-24 px-4 sm:px-6 md:px-8 lg:px-16">
      <EditForm />
    </div>
  );
}
