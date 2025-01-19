export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-gray-800">
        404 - Project Not Found
      </h1>
      <p className="text-gray-600 mt-4">
        The project you are looking for does not exist.
      </p>
    </div>
  );
}
