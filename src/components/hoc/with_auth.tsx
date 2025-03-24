import { useAuth } from "@/contexts/auth.context"
import { useRouter } from "next/navigation"


import { useEffect, useState } from "react"

export function withAuth(Component: React.ComponentType) {
  return function ProtectedComponent(props: any) {
    const router = useRouter()
    const { customer, isLoading } = useAuth()
    const [shouldRender, setShouldRender] = useState(false)

    useEffect(() => {
      if (!isLoading) {
        if (!customer) {
          router.replace("/login")
        } else {
          setShouldRender(true)
        }
      }
    }, [customer, isLoading, router])

    if (isLoading || !shouldRender) {
      return <div>Cargando...</div>
    }

    return <Component {...props} />
  }
}