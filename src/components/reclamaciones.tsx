"use client"

import type React from "react"
import { useState } from "react"
import { useEmail } from "@/contexts/email.context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function ReclamacionForm() {
  const { submitForm, isLoading } = useEmail()
  const [formData, setFormData] = useState({
    email: "",
    nombre: "",
    telefono: "",
    ordenNumero: "",
    fechaCompra: "",
    tipoReclamo: "",
    descripcion: "",
    solucion: "",
    aceptaTerminos: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, aceptaTerminos: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.email ||
      !formData.nombre ||
      !formData.ordenNumero ||
      !formData.fechaCompra ||
      !formData.tipoReclamo ||
      !formData.descripcion ||
      !formData.solucion ||
      !formData.aceptaTerminos
    ) {
      toast.error("Por favor complete todos los campos requeridos")
      return
    }

    try {
      const response = await submitForm({
        ...formData,
        tipo: "reclamacion", // Identificar que es un formulario de reclamación
      })

      if (response.success) {
        toast.success(response.message || "¡Reclamación enviada correctamente!")
        setFormData({
          email: "",
          nombre: "",
          telefono: "",
          ordenNumero: "",
          fechaCompra: "",
          tipoReclamo: "",
          descripcion: "",
          solucion: "",
          aceptaTerminos: false,
        })
      } else {
        toast.error(response.message || "Error al enviar la reclamación")
      }
    } catch (error) {
      toast.error("Error al enviar el formulario de reclamación")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="nombre">
            Nombre completo <span className="text-red-500">*</span>
          </Label>
          <Input
            id="nombre"
            name="nombre"
            type="text"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Tu nombre completo"
            required
          />
        </div>

        <div>
          <Label htmlFor="email">
            Correo electrónico <span className="text-red-500">*</span>
          </Label>
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            name="telefono"
            type="tel"
            value={formData.telefono}
            onChange={handleChange}
            placeholder="Tu número de teléfono"
          />
        </div>

        <div>
          <Label htmlFor="ordenNumero">
            Número de pedido <span className="text-red-500">*</span>
          </Label>
          <Input
            id="ordenNumero"
            name="ordenNumero"
            type="text"
            value={formData.ordenNumero}
            onChange={handleChange}
            placeholder="Ej: ORD-12345"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="fechaCompra">
          Fecha de compra <span className="text-red-500">*</span>
        </Label>
        <Input
          id="fechaCompra"
          name="fechaCompra"
          type="date"
          value={formData.fechaCompra}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label htmlFor="tipoReclamo">
          Tipo de reclamación <span className="text-red-500">*</span>
        </Label>
        <Select onValueChange={(value) => handleSelectChange("tipoReclamo", value)} value={formData.tipoReclamo}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una opción" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="producto-defectuoso">Producto defectuoso</SelectItem>
            <SelectItem value="pedido-incompleto">Pedido incompleto</SelectItem>
            <SelectItem value="retraso-entrega">Retraso en la entrega</SelectItem>
            <SelectItem value="producto-incorrecto">Producto incorrecto</SelectItem>
            <SelectItem value="problema-calidad">Problema de calidad</SelectItem>
            <SelectItem value="otro">Otro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="descripcion">
          Descripción detallada del problema <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="descripcion"
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          placeholder="Describe detalladamente el problema que has experimentado..."
          rows={5}
          required
        />
      </div>

      <div>
        <Label htmlFor="solucion">
          Solución solicitada <span className="text-red-500">*</span>
        </Label>
        <Select onValueChange={(value) => handleSelectChange("solucion", value)} value={formData.solucion}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una opción" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="reembolso">Reembolso completo</SelectItem>
            <SelectItem value="reemplazo">Reemplazo del producto</SelectItem>
            <SelectItem value="reparacion">Reparación</SelectItem>
            <SelectItem value="compensacion">Compensación</SelectItem>
            <SelectItem value="otro">Otro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Adjuntar archivos (opcional)</Label>
        <Input type="file" multiple className="cursor-pointer" />
        <p className="text-xs text-muted-foreground">
          Puedes adjuntar imágenes, comprobantes de compra u otros documentos relevantes (máx. 5MB por archivo)
        </p>
      </div>

      <div className="flex items-start space-x-3">
        <Checkbox id="terminos" checked={formData.aceptaTerminos} onCheckedChange={handleCheckboxChange} required />
        <Label htmlFor="terminos" className="text-sm text-muted-foreground font-normal">
          Declaro que la información proporcionada es verdadera y acepto el tratamiento de mis datos personales de
          acuerdo con la{" "}
          <a href="/privacidad" className="text-pink-600 hover:underline">
            política de privacidad
          </a>
          .
        </Label>
      </div>

      <Button type="submit" className="w-full md:w-auto" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          "Enviar Reclamación"
        )}
      </Button>
    </form>
  )
}
