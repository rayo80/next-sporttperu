import { useCategories } from "@/contexts/categories.context"
import Link from "next/link"


export function CategoriesSidebar() {
  const {items: categories} = useCategories()
  return (
    <div className="w-full">
      <h2 className="bg-pink-500 text-white py-3 px-4 text-center">Categorias</h2>
      <nav className="border rounded-b-lg">
        <ul className="py-2">
          {categories.map((category) => (
            <li key={category.slug}>
              <Link
                href={"/collections/"+category.slug}
                className="block px-4 py-2 hover:bg-accent text-sm"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

