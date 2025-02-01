import Image from "next/image"
import Link from "next/link"

const promos = [
  {
    image: "/assets/prom1.webp",
    url: "#",
    gradient: "from-blue-400 to-blue-600",
  },
  {
    image: "/assets/prom2.webp",
    url: "#",
    gradient: "from-teal-400 to-blue-600",
  },
  {
    image: "/assets/prom3.webp",
    url: "#",
    gradient: "from-blue-300 to-purple-600",
  },
]

export function PromoBanners() {
  return (
    <section className="container mx-auto px-2 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
        {promos.map((promo, index) => (
          <Link key={index} href={promo.url} className=" rounded-sm block group relative overflow-hidden aspect-[4/4]">
            <div className={`absolute  inset-0 bg-gradient-to-br ${promo.gradient} opacity-90`} />

            {/* Product Image */}
            <div className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
              <Image
                src={promo.image || "/placeholder.svg"}
                alt={`${index}`}
                width={400}
                height={300}
                className="object-contain"
              />
            </div>

          </Link>
        ))}
      </div>
    </section>
  )
}