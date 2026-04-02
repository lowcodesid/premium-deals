import { redirect } from "next/navigation"
import { getUser } from "@/lib/auth/get-user"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { UserPreferencesForm } from "@/components/user-preferences-form"

export default async function SettingsPage() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  const supabase = await createClient()

  let { data: preferences } = await supabase.from("user_preferences").select("*").eq("user_id", user.id).single()

  // Create default preferences if they don't exist
  if (!preferences) {
    const { data: newPreferences } = await supabase
      .from("user_preferences")
      .insert({
        user_id: user.id,
        email_notifications: true,
        notification_frequency: "instant",
      })
      .select()
      .single()

    preferences = newPreferences
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation isLoggedIn={true} />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-space mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your notification preferences</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="font-space">Notification Preferences</CardTitle>
              <CardDescription>Control how and when you receive deal alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <UserPreferencesForm userId={user.id} preferences={preferences} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
