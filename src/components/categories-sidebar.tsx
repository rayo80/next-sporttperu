import { useCategories } from "@/contexts/categories.context"
import Link from "next/link"

export function CategoriesSidebar() {
  const { items: categories } = useCategories()
  const limitedCategories = categories.slice(0, 9)

  return (
    <div className="w-full">
      <h2 className="bg-pink-500 text-white rounded-t-md py-3 px-4 text-center">
        Categorías
      </h2>
      <nav className="border rounded-b-lg">
        <ul className="py-1">
          {limitedCategories.map((category) => (
            <li key={category.slug}>
              <Link
                href={`/categories/${category.slug}`}
                className="block px-4 py-2.5 hover:bg-accent text-sm font-light"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
        <div className="px-4 pb-3">
          <Link
            href="/categories/all"
            className="block bg-gradient-to-br from-white to-gray-200 shadow-md shadow-slate-100 border border-gray-200 hover:bg-gray-300 text-center text-sm  py-2 rounded-md"
          >
            Explorar Tienda
          </Link>
        </div>
      </nav>
    </div>
  )
}
