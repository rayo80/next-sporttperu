"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useAuth } from "@/contexts/auth.context"

export default function AccountPage() {
    const router = useRouter()
    const { customer, logout, isLoading } = useAuth()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
    })

    useEffect(() => {
        if (!isLoading && !customer) {
        router.push("/login")
        }
    }, [customer, isLoading, router])

    useEffect(() => {
        if (customer) {
        setFormData({
            firstName: customer.firstName,
            lastName: customer.lastName,
            email: customer.email,
            phone: customer.phone,
        })
        }
    }, [customer])

    if (isLoading) {
        return <div>Cargando...</div>
    }

    if (!customer) {
        return <div>Redirigiendo...</div>
      }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        // Aquí iría la lógica para actualizar la información del cliente
        // Por ahora, solo mostraremos un mensaje de éxito
        toast.success("Información actualizada con éxito")
        setIsEditing(false)
    }

    const handleLogout = async () => {
        try {
        await logout()
        router.push("/")
        } catch (error) {
        console.error("Error al cerrar sesión:", error)
        toast.error("Error al cerrar sesión. Por favor, inténtalo de nuevo.")
        }
    }

    return (
        <>
        <SiteHeader />
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Mi Cuenta</h1>
            <div className="grid md:grid-cols-3 gap-8">
            <Card>
                <CardHeader>
                <CardTitle>Información Personal</CardTitle>
                <CardDescription>Gestiona tu información personal</CardDescription>
                </CardHeader>
                <CardContent>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                    <div>
                        <Label htmlFor="firstName">Nombre</Label>
                        <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        />
                    </div>
                    <div>
                        <Label htmlFor="lastName">Apellidos</Label>
                        <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        />
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        />
                    </div>
                    <div>
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        />
                    </div>
                    {isEditing ? (
                        <Button type="submit">Guardar Cambios</Button>
                    ) : (
                        <Button type="button" onClick={() => setIsEditing(true)}>
                        Editar Información
                        </Button>
                    )}
                    </div>
                </form>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                <CardTitle>Direcciones</CardTitle>
                <CardDescription>Gestiona tus direcciones de envío</CardDescription>
                </CardHeader>
                <CardContent>
                <div className="space-y-4">
                    {customer.addresses.map((address) => (
                    <div key={address.id} className="border p-4 rounded-md">
                        <p>{address.address1}</p>
                        <p>
                        {address.city}, {address.province}
                        </p>
                        <p>{address.zip}</p>
                        <div className="mt-2">
                        <Button variant="outline" size="sm" className="mr-2">
                            Editar
                        </Button>
                        <Button variant="outline" size="sm">
                            Eliminar
                        </Button>
                        </div>
                    </div>
                    ))}
                    <Button>Agregar Nueva Dirección</Button>
                </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                <CardTitle>Acciones de Cuenta</CardTitle>
                <CardDescription>Gestiona tu cuenta</CardDescription>
                </CardHeader>
                <CardContent>
                <div className="space-y-4">
                    <Button variant="outline" className="w-full" onClick={() => router.push("/account/orders")}>
                    Ver Mis Pedidos
                    </Button>
                    <Button variant="outline" className="w-full">
                    Cambiar Contraseña
                    </Button>
                    <Button variant="destructive" className="w-full" onClick={handleLogout}>
                    Cerrar Sesión
                    </Button>
                </div>
                </CardContent>
            </Card>
            </div>
        </main>
        </>
    )
}

