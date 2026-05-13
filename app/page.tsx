import Link from "next/link";

// Simple fetch function to hit our NestJS REST endpoint
async function getTopics() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/topics`, {
    cache: "no-store", // Real-time apps shouldn't heavily cache the lobby
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function Home() {
  const topics = await getTopics();

  return (
    <main className="max-w-5xl mx-auto p-8">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-bold tracking-tight">Active Debates</h1>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-semibold transition">
          Create Topic
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {topics.map((topic: any) => (
          <div
            key={topic.id}
            className="border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition"
          >
            <h2 className="text-xl font-bold mb-2">{topic.title}</h2>
            <p className="text-gray-600 mb-4">{topic.description}</p>
            <Link
              href={`/debate/${topic.id}`}
              className="text-blue-600 font-semibold hover:underline"
            >
              Enter Room &rarr;
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
