// "use client"

// import { useState } from "react"
// import { supabase } from "@/lib/supabase"
// import { useRouter } from "next/navigation"

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card } from "@/components/ui/card"

// import SuccessPopup from "@/components/auth/success-popup"

// export default function SignupPage() {

//   const router = useRouter()

//   const [email,setEmail] = useState("")
//   const [password,setPassword] = useState("")
//   const [showPopup,setShowPopup] = useState(false)

//   const handleSignup = async () => {

//     const { error } = await supabase.auth.signUp({
//       email,
//       password
//     })

//     if(!error){
//       setShowPopup(true)

//       setTimeout(()=>{
//         router.push("/signin")
//       },3000)
//     }
//   }

//   return (

//     <div className="flex items-center justify-center h-screen">

//       {showPopup && (
//         <SuccessPopup message="Account created! Please check your email to verify." />
//       )}

//       <Card className="p-6 w-96 space-y-4">

//         <h1 className="text-2xl font-bold text-center">
//           Create Account
//         </h1>

//         <Input
//           placeholder="Email"
//           onChange={(e)=>setEmail(e.target.value)}
//         />

//         <Input
//           type="password"
//           placeholder="Password"
//           onChange={(e)=>setPassword(e.target.value)}
//         />

//         <Button
//           onClick={handleSignup}
//           className="w-full"
//         >
//           Sign Up
//         </Button>

//       </Card>

//     </div>
//   )
// }

"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Mail, Lock, Leaf, TreeDeciduous, Globe, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import SuccessPopup from "@/components/auth/success-popup"

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPopup, setShowPopup] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSignup = async () => {
    setIsLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (!error) {
      setShowPopup(true)
      setTimeout(() => {
        router.push("/signin")
      }, 3000)
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#f0f9f4]">
      {showPopup && <SuccessPopup message="🌱 Account created! Check your email to verify." />}

      {/* LEFT SIDE: Content & Branding */}
      <div className="hidden md:flex md:w-1/2 bg-emerald-700 p-12 flex-col justify-between text-white relative overflow-hidden">
        {/* Abstract Background Decoration */}
        <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-emerald-600 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-[-5%] right-[-5%] w-96 h-96 bg-green-500 rounded-full blur-3xl opacity-30" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <Leaf className="w-8 h-8 text-green-300" />
            <span className="text-2xl font-bold tracking-tight">EcoScore</span>
          </div>

          <h2 className="text-5xl font-extrabold leading-tight mb-6">
            Track your footprint, <br />
            <span className="text-green-300">Save the planet.</span>
          </h2>
          
          <div className="space-y-6 max-w-md">
            <div className="flex gap-4 items-start">
              <div className="bg-emerald-600/50 p-2 rounded-lg"><Globe className="w-6 h-6" /></div>
              <p className="text-emerald-50 text-lg">Real-time tracking of your carbon emissions and environmental impact.</p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-emerald-600/50 p-2 rounded-lg"><Sparkles className="w-6 h-6" /></div>
              <p className="text-emerald-50 text-lg">Personalized AI recommendations to reduce your daily waste.</p>
            </div>
            <div className="flex gap-4 items-start">
              <div className="bg-emerald-600/50 p-2 rounded-lg"><TreeDeciduous className="w-6 h-6" /></div>
              <p className="text-emerald-50 text-lg">Join 50k+ eco-warriors making a measurable difference.</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 border-t border-emerald-600 pt-8">
          <p className="text-sm italic opacity-80">
            "We don't need a handful of people doing zero waste perfectly. We need millions of people doing it imperfectly."
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Signup Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
            <p className="text-gray-500 mt-2">Start your journey toward a greener lifestyle today.</p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-emerald-500" />
                <Input
                  type="email"
                  placeholder="name@example.com"
                  className="pl-10 border-gray-200 focus:ring-emerald-500 focus:border-emerald-500 rounded-xl py-6"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-emerald-500" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 border-gray-200 focus:ring-emerald-500 focus:border-emerald-500 rounded-xl py-6"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button
              onClick={handleSignup}
              disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-6 rounded-xl transition-all duration-200 shadow-lg shadow-emerald-200"
            >
              {isLoading ? "Planting seeds..." : "Join the Movement 🌱"}
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button 
                onClick={() => router.push("/signin")}
                className="text-emerald-600 font-semibold hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>

          {/* Trust Badge */}
          <div className="flex items-center justify-center gap-4 pt-4 grayscale opacity-60">
            <div className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Secure & Sustainable</div>
          </div>
        </div>
      </div>
    </div>
  )
}