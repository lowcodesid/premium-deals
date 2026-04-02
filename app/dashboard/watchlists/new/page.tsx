import { redirect } from "next/navigation"
import { getUser } from "@/lib/auth/get-user"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { WatchlistForm } from "@/components/watchlist-form"

export default async function NewWatchlistPage() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation isLoggedIn={true} />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Button asChild variant="ghost" className="mb-6">
            <Link href="/dashboard/watchlists">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Watchlists
            </Link>
          </Button>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold font-space mb-2">Create Watchlist</h1>
            <p className="text-muted-foreground leading-relaxed">
              Set up alerts for your preferred routes and we'll notify you when matching deals appear.
            </p>
          </div>

          <WatchlistForm userId={user.id} />
        </div>
      </div>
    </div>
  )
}
