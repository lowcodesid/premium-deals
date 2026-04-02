"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import type { UserPreferences } from "@/lib/types/deal"

interface UserPreferencesFormProps {
  userId: string
  preferences: UserPreferences | null
}

export function UserPreferencesForm({ userId, preferences }: UserPreferencesFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [emailNotifications, setEmailNotifications] = useState(preferences?.email_notifications ?? true)
  const [notificationFrequency, setNotificationFrequency] = useState(preferences?.notification_frequency ?? "instant")

  const handleSave = async () => {
    setIsLoading(true)
    const supabase = createClient()

    try {
      const { error } = await supabase
        .from("user_preferences")
        .update({
          email_notifications: emailNotifications,
          notification_frequency: notificationFrequency,
        })
        .eq("user_id", userId)

      if (error) throw error

      toast({
        title: "Settings saved",
        description: "Your notification preferences have been updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label htmlFor="email-notifications">Email Notifications</Label>
          <p className="text-sm text-muted-foreground">Receive deal alerts via email</p>
        </div>
        <Switch
          id="email-notifications"
          checked={emailNotifications}
          onCheckedChange={setEmailNotifications}
          disabled={isLoading}
        />
      </div>

      {emailNotifications && (
        <div className="space-y-2">
          <Label htmlFor="frequency">Notification Frequency</Label>
          <Select value={notificationFrequency} onValueChange={setNotificationFrequency} disabled={isLoading}>
            <SelectTrigger id="frequency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="instant">Instant - As deals appear</SelectItem>
              <SelectItem value="daily">Daily Digest - Once per day</SelectItem>
              <SelectItem value="weekly">Weekly Summary - Once per week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <Button onClick={handleSave} disabled={isLoading} className="w-full">
        {isLoading ? "Saving..." : "Save Preferences"}
      </Button>
    </div>
  )
}
