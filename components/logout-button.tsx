"use client"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export function LogoutButton() {
  const router = useRouter()
  const { toast } = useToast()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()

    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    })

    router.push("/")
    router.refresh()
  }

  return (
    <Button onClick={handleLogout} variant="ghost" size="sm">
      <LogOut className="h-4 w-4 mr-2" />
      Logout
    </Button>
  )
}
