"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function SearchDialog() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-white hover:text-pink-500">
          <Search className="h-5 w-5" />
          <span className="sr-only">Buscar</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Buscar productos</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Input
              type="text"
              placeholder="¿Qué estás buscando?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
              autoFocus
            />
          </div>
          <Button type="submit" size="sm" className="px-3 bg-pink-500 hover:bg-pink-600">
            <span className="sr-only">Buscar</span>
            <Search className="h-4 w-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}