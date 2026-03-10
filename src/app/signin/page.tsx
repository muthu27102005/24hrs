// "use client"

// import { useState } from "react"
// import { supabase } from "@/lib/supabase"
// import { useRouter } from "next/navigation"

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card } from "@/components/ui/card"

// export default function SigninPage(){

//   const router = useRouter()

//   const [email,setEmail] = useState("")
//   const [password,setPassword] = useState("")

//   const handleSignin = async ()=>{

//     const { error } = await supabase.auth.signInWithPassword({
//       email,
//       password
//     })

//     if(!error){
//       router.push("/dashboard")
//     }

//   }

//   return(

//     <div className="flex items-center justify-center h-screen">

//       <Card className="p-6 w-96 space-y-4">

//         <h1 className="text-2xl font-bold text-center">
//           Sign In
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
//           onClick={handleSignin}
//           className="w-full"
//         >
//           Login
//         </Button>

//       </Card>

//     </div>
//   )
// }



"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { Mail, Lock, Leaf, ArrowRight, ShieldCheck, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function SigninPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const handleSignin = async () => {
    setIsLoading(true)
    setErrorMsg("")
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (!error) {
      router.push("/dashboard")
    } else {
      setErrorMsg(error.message)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#f0f9f4]">
      
      {/* LEFT SIDE: Motivation & Brand */}
      <div className="hidden md:flex md:w-1/2 bg-emerald-800 p-12 flex-col justify-between text-white relative overflow-hidden">
        {/* Decorative Eco-Circles */}
        <div className="absolute top-[-20%] right-[-10%] w-80 h-80 bg-emerald-600 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-[-10%] left-[-10%] w-72 h-72 bg-green-500 rounded-full blur-3xl opacity-20" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-12 cursor-pointer" onClick={() => router.push("/")}>
            <Leaf className="w-8 h-8 text-green-400" />
            <span className="text-2xl font-bold tracking-tight italic">EcoScore</span>
          </div>

          <h2 className="text-5xl font-extrabold leading-tight mb-8">
            Welcome back, <br />
            <span className="text-green-400">Eco-Warrior.</span>
          </h2>

          <div className="space-y-8 max-w-sm">
            <div className="flex items-center gap-4 group">
              <div className="bg-white/10 p-3 rounded-2xl group-hover:bg-emerald-500/30 transition-colors">
                <Zap className="w-6 h-6 text-green-300" />
              </div>
              <div>
                <h4 className="font-bold text-lg">Ready to optimize?</h4>
                <p className="text-emerald-100/70 text-sm">Your dashboard is updated with new sustainability tips.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="bg-white/10 p-3 rounded-2xl group-hover:bg-emerald-500/30 transition-colors">
                <ShieldCheck className="w-6 h-6 text-green-300" />
              </div>
              <div>
                <h4 className="font-bold text-lg">Secure Impact</h4>
                <p className="text-emerald-100/70 text-sm">Your data helps us plant trees across the globe.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 bg-emerald-900/40 p-6 rounded-2xl border border-emerald-700/50 backdrop-blur-sm">
          <p className="text-sm font-medium text-emerald-200">
            🌱 Fun Fact: Living sustainably can save you an average of $1,200 per year in energy and waste costs.
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Login</h1>
            <p className="text-gray-500 mt-3 font-medium">Continue your journey toward a zero-waste life.</p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 animate-in fade-in zoom-in duration-300">
              ⚠️ {errorMsg}
            </div>
          )}

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-widest font-bold text-gray-400 ml-1">Account Email</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                <Input
                  type="email"
                  placeholder="warrior@ecoscore.com"
                  className="pl-12 h-14 border-gray-100 bg-gray-50 focus:bg-white focus:ring-emerald-500 rounded-2xl transition-all shadow-sm"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs uppercase tracking-widest font-bold text-gray-400">Password</label>
                <button className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold">Forgot?</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  className="pl-12 h-14 border-gray-100 bg-gray-50 focus:bg-white focus:ring-emerald-500 rounded-2xl transition-all shadow-sm"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button
              onClick={handleSignin}
              disabled={isLoading}
              className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg rounded-2xl transition-all duration-300 shadow-xl shadow-emerald-100 flex items-center justify-center gap-2 group"
            >
              {isLoading ? "Checking credentials..." : "Resume Impact"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>

          <div className="text-center pt-4">
            <p className="text-gray-500">
              New to the movement?{" "}
              <button 
                onClick={() => router.push("/signup")}
                className="text-emerald-600 font-bold hover:text-emerald-700 underline underline-offset-4"
              >
                Create Account
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}