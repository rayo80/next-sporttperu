"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { useEffect, useState } from "react"

interface FilterOption {
  id: string
  label: string
}

interface FilterAccordionProps {
  title: string
  options: FilterOption[]
  onFilterChange: (updatedSelection: string[]) => void
}

export function FilterAccordion({ title, options, onFilterChange}: FilterAccordionProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  console.log('Selection', selectedOptions)
  const handleCheckedChange = (id: string) => {
    setSelectedOptions((prev) => {
      const isSelected = prev.includes(id);
      const updatedSelection = isSelected
        ? prev.filter((option) => option !== id) // Eliminar si ya estaba
        : [...prev, id]; // Agregar si no estaba
        onFilterChange(updatedSelection)
      return updatedSelection;
    });}



  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="text-lg font-medium hover:no-underline">
          {title}
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            {options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={option.id}
                  onCheckedChange={() => handleCheckedChange(option.id)}
                />
                <label
                  htmlFor={option.id}
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
