"use client"

import type React from "react"

import { useState } from "react"
import { useEmail } from "@/contexts/email.context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export function ContactForm() {
  const { submitForm, isLoading } = useEmail()
  const [formData, setFormData] = useState({
    email: "",
    nombre: "",
    asunto: "",
    mensaje: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.nombre || !formData.mensaje) {
      toast.error("Por favor complete los campos requeridos")
      return
    }

    try {
      const response = await submitForm({
        ...formData,
        tipo: "contacto", // Añadir un campo para identificar el tipo de formulario
      })

      if (response.success) {
        toast.success(response.message || "¡Mensaje enviado correctamente!")
        setFormData({
          email: "",
          nombre: "",
          asunto: "",
          mensaje: "",
        })
      } else {
        toast.error(response.message || "Error al enviar el formulario")
      }
    } catch (error) {
      toast.error("Error al enviar el formulario de contacto")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="nombre">Nombre</Label>
        <Input
          id="nombre"
          name="nombre"
          type="text"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Tu nombre"
          required
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="tu@email.com"
          required
        />
      </div>

      <div>
        <Label htmlFor="asunto">Asunto</Label>
        <Input
          id="asunto"
          name="asunto"
          type="text"
          value={formData.asunto}
          onChange={handleChange}
          placeholder="Asunto del mensaje"
        />
      </div>

      <div>
        <Label htmlFor="mensaje">Mensaje</Label>
        <Textarea
          id="mensaje"
          name="mensaje"
          value={formData.mensaje}
          onChange={handleChange}
          placeholder="Escribe tu mensaje aquí..."
          rows={5}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Enviando..." : "Enviar mensaje"}
      </Button>
    </form>
  )
}

