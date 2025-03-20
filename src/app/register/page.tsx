"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import type { CreateCustomerDto } from "@/types/customer"
import { useAuth } from "@/contexts/auth.context"

interface FormErrors {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  password?: string
  confirmPassword?: string
  address1?: string
  city?: string
  province?: string
  zip?: string
}

interface FormData extends CreateCustomerDto {
  confirmPassword?: string
  isRegistration: boolean
}

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    isRegistration: true,
    acceptsMarketing: false,
    addresses: [
      {
        isDefault: true,
        company: "",
        address1: "",
        address2: "",
        city: "",
        province: "",
        zip: "",
        country: "PE",
        phone: "",
      },
    ],
  })

  const validateField = (name: string, value: string): string | undefined => {
    console.log('name', name, value)
    if (!formData.isRegistration && (name === "email" || name === "password" || name === "confirmPassword")) {
      return undefined
    }

    switch (name) {
      case "firstName":
        return !value ? "El nombre es requerido" : undefined
      case "lastName":
        return !value ? "Los apellidos son requeridos" : undefined
      case "email":
        return !value || !value.includes("@") ? "Email inválido" : undefined
      case "phone":
        return !value ? "El teléfono es requerido" : undefined
      case "password":
        return value.length < 6 ? "La contraseña debe tener al menos 6 caracteres" : undefined
      case "confirmPassword":
        return value !== formData.password ? "Las contraseñas no coinciden" : undefined
      case "address1":
        return !value ? "La dirección es requerida" : undefined
      case "city":
        return !value ? "La ciudad es requerida" : undefined
      case "province":
        return !value ? "La región es requerida" : undefined
      case "zip":
        return !value ? "El código postal es requerido" : undefined
      default:
        return undefined
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    const error = validateField(name, value)
    setFormErrors((prev) => ({ ...prev, [name]: error }))
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    console.log('name', name, value)
    setFormData((prev) => ({
      ...prev,
      addresses: [
        {
          ...prev.addresses[0],
          [name]: value,
        },
      ],
    }))
    const error = validateField(name, value)
    setFormErrors((prev) => ({ ...prev, [name]: error }))
  }

  const validateForm = (): boolean => {
    const errors: FormErrors = {}
    let isValid = true

    const fieldsToValidate = ["firstName", "lastName", "phone"]

    if (formData.isRegistration) {
      fieldsToValidate.push("email", "password", "confirmPassword")
    }

    fieldsToValidate.forEach((field) => {
      const error = validateField(field, formData[field as keyof typeof formData] as string)
      if (error) {
        errors[field as keyof FormErrors] = error
        isValid = false
      }
    })

    // Validate address fields
    const addressFieldsToValidate = ["address1", "city", "province", "zip"]
    addressFieldsToValidate.forEach((field) => {
      const error = validateField(field, formData.addresses[0][field as keyof (typeof formData.addresses)[0]] as string)
      if (error) {
        errors[field as keyof FormErrors] = error
        isValid = false
      }
    })

    setFormErrors(errors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    console.log('formData', formData)
    if (!validateForm()) {
      setIsSubmitting(false)
      toast.error("Por favor, complete todos los campos requeridos correctamente")
      return
    }

    try {
      if (formData.isRegistration) {
        // Registration process
        const { confirmPassword, isRegistration, ...registerData } = formData
        await register(registerData as CreateCustomerDto)
        toast.success("¡Registro exitoso!")
        router.push("/login")
      } else {
        // Order creation process
        // Here you would typically call a different function to handle order creation
        // For now, we'll just show a success message
        toast.success("Orden creada exitosamente")
        router.push("/") // Redirect to home or order confirmation page
      }
    } catch (error) {
      console.error("Error:", error)
      toast.error(error instanceof Error ? error.message : "Ha ocurrido un error. Por favor, inténtelo de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {formData.isRegistration ? "Crear cuenta" : "Información del cliente"}
          </CardTitle>
          <CardDescription>
            {formData.isRegistration ? (
              <>
                Ingresa tus datos para crear una cuenta. ¿Ya tienes una cuenta?{" "}
                <Link href="/login" className="text-pink-500 hover:text-pink-600">
                  Iniciar sesión
                </Link>
              </>
            ) : (
              "Por favor, ingresa tus datos para completar la orden"
            )}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-medium">Información Personal</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={formErrors.firstName ? "border-red-500" : ""}
                  />
                  {formErrors.firstName && <p className="text-sm text-red-500">{formErrors.firstName}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellidos</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={formErrors.lastName ? "border-red-500" : ""}
                  />
                  {formErrors.lastName && <p className="text-sm text-red-500">{formErrors.lastName}</p>}
                </div>
              </div>
              {formData.isRegistration && (
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email ?? ""}
                    onChange={handleInputChange}
                    className={formErrors.email ? "border-red-500" : ""}
                  />
                  {formErrors.email && <p className="text-sm text-red-500">{formErrors.email}</p>}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={formErrors.phone ? "border-red-500" : ""}
                />
                {formErrors.phone && <p className="text-sm text-red-500">{formErrors.phone}</p>}
              </div>
              {formData.isRegistration && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={formErrors.password ? "border-red-500" : ""}
                    />
                    {formErrors.password && <p className="text-sm text-red-500">{formErrors.password}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={formErrors.confirmPassword ? "border-red-500" : ""}
                    />
                    {formErrors.confirmPassword && <p className="text-sm text-red-500">{formErrors.confirmPassword}</p>}
                  </div>
                </div>
              )}
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className="font-medium">Dirección de Envío</h3>
              <div className="space-y-2">
                <Label htmlFor="company">Empresa (opcional)</Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.addresses[0].company}
                  onChange={handleAddressChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address1">Dirección</Label>
                <Input
                  id="address1"
                  name="address1"
                  value={formData.addresses[0].address1}
                  onChange={handleAddressChange}
                  className={formErrors.address1 ? "border-red-500" : ""}
                />
                {formErrors.address1 && <p className="text-sm text-red-500">{formErrors.address1}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="address2">Apartamento, suite, etc. (opcional)</Label>
                <Input
                  id="address2"
                  name="address2"
                  value={formData.addresses[0].address2}
                  onChange={handleAddressChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.addresses[0].city}
                    onChange={handleAddressChange}
                    className={formErrors.city ? "border-red-500" : ""}
                  />
                  {formErrors.city && <p className="text-sm text-red-500">{formErrors.city}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province">Región</Label>
                  <Select
                    name="province"
                    value={formData.addresses[0].province}
                    onValueChange={(value) =>
                      handleAddressChange({
                        target: { name: "province", value },
                      } as React.ChangeEvent<HTMLInputElement>)
                    }
                  >
                    <SelectTrigger className={formErrors.province ? "border-red-500" : ""}>
                      <SelectValue placeholder="Seleccionar región" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lima">Lima</SelectItem>
                      <SelectItem value="arequipa">Arequipa</SelectItem>
                      <SelectItem value="cusco">Cusco</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.province && <p className="text-sm text-red-500">{formErrors.province}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zip">Código Postal</Label>
                  <Input
                    id="zip"
                    name="zip"
                    value={formData.addresses[0].zip}
                    onChange={handleAddressChange}
                    className={formErrors.zip ? "border-red-500" : ""}
                  />
                  {formErrors.zip && <p className="text-sm text-red-500">{formErrors.zip}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">País</Label>
                  <Select name="country" defaultValue="PE" disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar país" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PE">Perú</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {formData.isRegistration && (
              <div className="flex items-start gap-2">
                <Checkbox id="marketing" />
                <Label htmlFor="marketing" className="text-sm leading-none">
                  Me gustaría recibir ofertas especiales, recomendaciones y consejos por email
                </Label>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-pink-500 hover:bg-pink-600" disabled={isSubmitting}>
              {isSubmitting
                ? formData.isRegistration
                  ? "Creando cuenta..."
                  : "Procesando..."
                : formData.isRegistration
                  ? "Crear cuenta"
                  : "Continuar con el pedido"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

