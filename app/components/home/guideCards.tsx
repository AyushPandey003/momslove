import Image from "next/image";

const guides = [
    {
      title: "AI Basics",
      imageUrl: "/images/hero.avif",
    },
    {
      title: "Web Development",
      imageUrl: "/images/hero.avif",
    },
    {
      title: "Data Science",
      imageUrl: "/images/hero.avif",
    },
    // {
    //   title: "Cloud Computing",
    //   imageUrl: "/images/hero.avif",
    // },
    // {
    //   title: "Cybersecurity",
    //   imageUrl: "/images/hero.avif",
    // },
    // {
    //   title: "Blockchain",
    //   imageUrl: "/images/hero.avif",
    // },
  ];
  
  export default function GuideCards() {
    return (
      <section className="bg-black py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white mb-10 text-center">
            Find Your Complete Guide To
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {guides.map((guide, index) => (
              <div
                key={index}
                className="bg-white overflow-hidden shadow-lg hover:shadow-2xl transition duration-300"
              >
                <div className="relative">
                  <Image
                    width={400}
                    height={300}
                    src={guide.imageUrl}
                    alt={guide.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-center py-2">
                    <h3 className="text-lg font-semibold">{guide.title}</h3>
                  </div>
                </div>
                <div className="p-4 text-center">
                  <button className="bg-white text-black border border-black px-4 py-2 text-sm font-medium  hover:bg-gray-100 transition">
                    Read More →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  