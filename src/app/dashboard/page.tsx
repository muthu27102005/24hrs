import { Bell, Bike, Leaf, Recycle, Sparkles, Trophy, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const weeklyTips = [
  "Choose public transport 2 days this week.",
  "Carry a reusable bottle to avoid 7 plastic bottles.",
  "Switch one short ride to walking.",
]

const recentActivities = [
  { label: "Bus ride logged", points: "+24", time: "2h ago" },
  { label: "Plastic reduction challenge", points: "+18", time: "Yesterday" },
  { label: "Energy saver streak", points: "+32", time: "2 days ago" },
]

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#e8fff2,#f7fcf9_40%,#ffffff_75%)] px-4 py-8 md:px-8">
      <section className="mx-auto w-full max-w-6xl space-y-8">
        <header className="rounded-3xl border border-emerald-100 bg-white/80 p-6 shadow-xl shadow-emerald-100/40 backdrop-blur md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                <Sparkles className="h-4 w-4" />
                Eco Performance
              </p>
              <h1 className="text-3xl font-black tracking-tight text-gray-900 md:text-4xl">Your Sustainability Dashboard</h1>
              <p className="mt-2 max-w-2xl text-sm text-gray-600 md:text-base">
                Track your transport footprint, build green habits, and improve your weekly impact score.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button className="rounded-2xl bg-emerald-600 px-6 py-6 text-sm font-bold hover:bg-emerald-700">
                Log New Activity
              </Button>
              <Button variant="outline" className="rounded-2xl border-emerald-200 px-4 py-6 text-emerald-700 hover:bg-emerald-50">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card className="rounded-3xl border-emerald-100 bg-white p-6 shadow-md shadow-emerald-100/30">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-500">Eco Score</p>
              <Leaf className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="mt-3 text-4xl font-black text-gray-900">842</p>
            <p className="mt-2 text-sm text-emerald-700">+9% from last week</p>
          </Card>

          <Card className="rounded-3xl border-emerald-100 bg-white p-6 shadow-md shadow-emerald-100/30">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-500">Carbon Saved</p>
              <Recycle className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="mt-3 text-4xl font-black text-gray-900">126 kg</p>
            <p className="mt-2 text-sm text-emerald-700">Equivalent to planting 6 trees</p>
          </Card>

          <Card className="rounded-3xl border-emerald-100 bg-white p-6 shadow-md shadow-emerald-100/30">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-500">Current Streak</p>
              <Zap className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="mt-3 text-4xl font-black text-gray-900">14 days</p>
            <p className="mt-2 text-sm text-emerald-700">Keep going to unlock a bonus</p>
          </Card>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Card className="rounded-3xl border-emerald-100 bg-white p-6 shadow-md shadow-emerald-100/30 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
              <p className="text-sm text-gray-500">This week</p>
            </div>

            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div
                  key={activity.label}
                  className="flex items-center justify-between rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-white p-2 text-emerald-600 shadow-sm">
                      <Bike className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{activity.label}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-emerald-700">{activity.points}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="rounded-3xl border-emerald-100 bg-white p-6 shadow-md shadow-emerald-100/30">
            <div className="mb-4 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-emerald-600" />
              <h2 className="text-xl font-bold text-gray-900">Weekly Goals</h2>
            </div>

            <ul className="space-y-3">
              {weeklyTips.map((tip) => (
                <li key={tip} className="rounded-2xl border border-emerald-100 bg-emerald-50/40 px-4 py-3 text-sm text-gray-700">
                  {tip}
                </li>
              ))}
            </ul>
          </Card>
        </section>
      </section>
    </main>
  )
}