"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface FilterOption {
  id: string
  label: string
}

interface FilterAccordionProps {
  title: string
  options: FilterOption[]
  selectedOptions: string[]
  onFilterChange: (selectedOptions: string[]) => void
  className?: string
}

export function FilterAccordion({ title, options, selectedOptions, onFilterChange, className }: FilterAccordionProps) {
  const [isOpen, setIsOpen] = useState(false)

  // Función para traducir títulos comunes de inglés a español
  const translateTitle = (englishTitle: string): string => {
    const translations: Record<string, string> = {
      Category: "Categoría",
      Categories: "Categorías",
      Color: "Color",
      Colors: "Colores",
      Collection: "Colección",
      Collections: "Colecciones",
      Size: "Talla",
      Sizes: "Tallas",
      Brand: "Marca",
      Brands: "Marcas",
      Price: "Precio",
      Material: "Material",
      Style: "Estilo",
      Type: "Tipo",
      Feature: "Característica",
      Features: "Características",
    }

    // Devuelve la traducción si existe, o el título original si no hay traducción
    return translations[englishTitle] || englishTitle
  }

  const handleOptionChange = (optionId: string) => {
    const newSelection = selectedOptions.includes(optionId)
      ? selectedOptions.filter((id) => id !== optionId)
      : [...selectedOptions, optionId]

    onFilterChange(newSelection)
  }

  const handleClearAll = () => {
    onFilterChange([])
  }

  // Título traducido
  const translatedTitle = translateTitle(title)

  return (
    <div className={cn("rounded-lg border bg-card shadow-sm", className)}>
      <Accordion type="single" collapsible className="w-full" onValueChange={(value) => setIsOpen(!!value)}>
        <AccordionItem value="item-1" className="border-none px-1">
          <div className="flex items-center justify-between px-3">
            <AccordionTrigger className="text-lg font-medium hover:no-underline py-4 flex-1">
              <div className="flex items-center gap-2">
                {translatedTitle}
                {selectedOptions.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {selectedOptions.length}
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            {selectedOptions.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleClearAll()
                }}
                className="text-xs text-muted-foreground hover:text-primary transition-colors px-2 py-1 rounded"
              >
                Limpiar
              </button>
            )}
          </div>
          <AccordionContent className="pt-1 pb-3">
            <div className="space-y-1 px-1">
              {options.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center space-x-2 rounded-md px-2 py-1.5 hover:bg-accent transition-colors"
                >
                  <Checkbox
                    id={option.id}
                    checked={selectedOptions.includes(option.id)}
                    onCheckedChange={() => handleOptionChange(option.id)}
                    className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                  <label htmlFor={option.id} className="flex-1 text-sm cursor-pointer select-none">
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
