"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"

interface FilterOption {
  id: string
  label: string
}

interface FilterAccordionProps {
  title: string
  options: FilterOption[]
  selectedOptions: string[]
  onFilterChange: (selectedOptions: string[]) => void
}

export function FilterAccordion({ title, options, selectedOptions, onFilterChange }: FilterAccordionProps) {
  const handleOptionChange = (optionId: string) => {
    const newSelection = selectedOptions.includes(optionId)
      ? selectedOptions.filter((id) => id !== optionId)
      : [...selectedOptions, optionId]

    onFilterChange(newSelection)
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="text-lg font-medium hover:no-underline">{title}</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2">
            {options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={option.id}
                  checked={selectedOptions.includes(option.id)}
                  onCheckedChange={() => handleOptionChange(option.id)}
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
