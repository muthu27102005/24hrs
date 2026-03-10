"use client"

interface Props {
  message: string
}

export default function SuccessPopup({ message }: Props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      
      <div className="bg-green-500 text-white p-6 rounded-xl shadow-lg w-96 text-center">
        
        <h2 className="text-xl font-bold mb-2">
          Success
        </h2>

        <p>{message}</p>

      </div>

    </div>
  )
}