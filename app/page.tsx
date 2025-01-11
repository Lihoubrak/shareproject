'use client';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
    } else {
      console.log("Please enter a valid search query");
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 px-8 py-24 min-h-screen">
      {/* Header Section */}
      <div className="text-center mb-16">
        <p className="text-white opacity-90 mb-10 text-lg max-w-3xl mx-auto">
          វេទិកានេះមានបំណងផ្តល់ឱកាសសម្រាប់សហគមន៍ខ្មែរ! យើងផ្តល់កន្លែងមួយ
          ដើម្បីបោះពុម្ពអត្ថបទប្លក់ ចែករំលែកគម្រោងរបស់អ្នក និងធ្វើបានច្រើនទៀត
          —គ្រប់យ៉ាងដោយឥតគិតថ្លៃ។ មិនថាអ្នកជាសិស្ស ជាបុគ្គលិក
          ឬអ្នកចាប់អារម្មណ៍ទេ សូមចូលរួមជាមួយយើងដើម្បីចែករំលែកគំនិត
          និងការបង្កើតរបស់អ្នកជាមួយពិភពលោក!
        </p>

        {/* Search Bar */}
        <div className="ml-auto flex items-center justify-center gap-4">
          <input
            type="text"
            placeholder="ស្វែងរកគម្រោង"
            className="p-3 rounded-lg shadow-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 w-full max-w-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none"
            onClick={handleSearch}
          >
            ស្វែងរក
          </button>
        </div>
      </div>

      {/* Mission Section */}
      <Card className="max-w-3xl mx-auto p-8 bg-white shadow-xl rounded-xl transform transition duration-300 hover:scale-105 hover:shadow-2xl mb-16">
        <h3 className="text-center mb-6 text-3xl font-semibold text-gray-800">
          បេសកកម្មរបស់យើង
        </h3>
        <p className="text-center text-gray-600 leading-relaxed">
          បេសកកម្មរបស់យើងគឺជំរុញសហគមន៍ខ្មែរដោយផ្តល់វេទិកាដែលមានគ្រប់គ្នាអាចចែករំលែក
          ចំណេះដឹង ភាពច្នៃប្រឌិត និងគម្រោង។ យើងខំប្រឹងសម្រាប់ភាពល្អឥតខ្ចោះ
          ដើម្បីផ្តល់កន្លែងដែលអាចចូលរួមបានសម្រាប់គ្រប់គ្នា។ ចូលរួមជាមួយយើងដើម្បីធ្វើឱ្យមានឥទ្ធិពលអចិន្ត្រៃយ៍
          ក្នុងវិស័យបច្ចេកវិទ្យា ការរចនា និងការច្នៃប្រឌិត។
        </p>
      </Card>

      {/* Action Button */}
      <div className="flex justify-center mb-16">
        <Button className="bg-white text-blue-600 py-3 px-8 rounded-lg text-lg font-semibold transform transition duration-300 hover:scale-105 hover:bg-blue-100 hover:text-blue-800">
          ចាប់ផ្តើមដោយឥតគិតថ្លៃ
        </Button>
      </div>

      {/* Features Section */}
      <div className="mt-24">
        <div className="text-center mb-12">
          <h3 className="text-white text-4xl mb-6 font-semibold">
            អ្វីដែលអ្នកអាចធ្វើបាន
          </h3>
          <p className="text-white opacity-80 text-lg max-w-3xl mx-auto">
            វាគឺជាវេទិកាដោយឥតគិតថ្លៃដែលបម្រើសហគមន៍ខ្មែរ។ អ្នកអាចបោះពុម្ពអត្ថបទប្លក់
            បង្ហោះគម្រោងរបស់អ្នក ចែករំលែកការបង្កើត
            និងបង្ហោះបញ្ហាដើម្បីស្នើសុំឱ្យអ្នកផ្សេងជួយដោះស្រាយ។
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8 mb-12">
          {/* Create Blog Section */}
          <Card className="w-80 p-6 bg-white shadow-lg rounded-xl transform transition duration-300 hover:scale-105 hover:shadow-xl">
            <h3 className="text-center text-2xl mb-6 font-semibold text-gray-800">
              បង្កើតអត្ថបទប្លក់
            </h3>
            <p className="text-center text-gray-600 mb-4">
              សរសេរ និងចែករំលែកអត្ថបទរបស់អ្នកជាមួយសហគមន៍។
            </p>
            <div className="flex justify-center">
              <Button className="bg-blue-600 text-white py-3 px-6 rounded-lg text-lg font-semibold transform transition duration-300 hover:scale-105 hover:bg-blue-500">
                ចាប់ផ្តើមសរសេរ
              </Button>
            </div>
          </Card>

          {/* Upload Project Section */}
          <Card className="w-80 p-6 bg-white shadow-lg rounded-xl transform transition duration-300 hover:scale-105 hover:shadow-xl">
            <h3 className="text-center text-2xl mb-6 font-semibold text-gray-800">
              បង្ហោះគម្រោងរបស់អ្នក
            </h3>
            <p className="text-center text-gray-600 mb-4">
              បង្ហាញគំនិតនិងគម្រោងរបស់អ្នកចូលសហគមន៍។
            </p>
            <div className="flex justify-center">
              <Button className="bg-green-600 text-white py-3 px-6 rounded-lg text-lg font-semibold transform transition duration-300 hover:scale-105 hover:bg-green-500">
                បង្ហោះឥឡូវនេះ
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="text-center mt-16 mb-16">
        <h3 className="text-white text-4xl mb-6 font-semibold">
          មតិពីសហគមន៍
        </h3>
        <div className="flex flex-wrap justify-center gap-8">
          <Card className="w-96 p-6 bg-white shadow-lg rounded-xl">
            <p className="text-gray-800 text-lg leading-relaxed">
              &quot;វេទិកានេះជួយខ្ញុំចែករំលែកគំនិតថ្មីៗ ហើយធ្វើឱ្យសហគមន៍មានអត្ថប្រយោជន៍!&quot;
            </p>
            <h4 className="mt-4 text-gray-800 font-semibold">— សុខ ជា</h4>
          </Card>
          <Card className="w-96 p-6 bg-white shadow-lg rounded-xl">
            <p className="text-gray-800 text-lg leading-relaxed">
              &quot;ខ្ញុំបានរកឃើញការចូលរួម និងឱកាសថ្មីៗនៅក្នុងវេទិកានេះ។&quot;
            </p>
            <h4 className="mt-4 text-gray-800 font-semibold">— ចាន់ ថា</h4>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center mt-16 mb-16">
        <h3 className="text-white text-3xl mb-4 font-semibold">
          ចូលរួមជាមួយយើង!
        </h3>
        <Button className="bg-white text-blue-600 py-3 px-8 rounded-lg text-lg font-semibold transform transition duration-300 hover:scale-105 hover:bg-blue-100 hover:text-blue-800">
          ចាប់ផ្តើមឥឡូវនេះ
        </Button>
      </div>
    </div>
  );
}
