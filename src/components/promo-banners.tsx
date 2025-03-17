import Image from "next/image"
import Link from "next/link"

const promos = [
  {
    image: "/assets/prom1.png",
    url: "#",
    gradient: " ",
  },
  {
    image: "/assets/prom2.jpg",
    url: "/product/dignics-05",
    gradient: " ",
  },
  {
    image: "/assets/prom3.png",
    url: "/product/tenergy-05-fx",
    gradient: " ",
  },
]

export function PromoBanners() {
  return (
    <section className="container-section py-12">
      <div className="content-section grid grid-cols-1 md:grid-cols-3 gap-1">
        {promos.map((promo, index) => (
          <Link key={index} href={promo.url} className=" rounded-sm block group relative overflow-hidden aspect-[4/4]">
            {/* <div className={`absolute  inset-0 bg-gradient-to-br ${promo.gradient} opacity-90`} /> */}

            {/* Product Image */}
            <div className="absolute inset-0   flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
              <Image
                src={promo.image || "/placeholder.svg"}
                alt={`${index}`}
                width={500}
                height={400}
                className="object-contain"
              />
            </div>

          </Link>
        ))}
      </div>
    </section>
  )
}