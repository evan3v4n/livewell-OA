'use client'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../firebase"
import Link from "next/link"

export default function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push('/dashboard/patientdashboard');
        } catch (err) {
            console.log(err);
        }
    }

    return (
        
        <div className="max-w-md mx-auto my-10 p-8 border rounded shadow">
            <h1 className="text-xl font-bold text-center mb-6">Patient Login</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 p-2 w-full border rounded shadow-sm"
                    />

                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mt-4">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 p-2 w-full border rounded shadow-sm"
                    />

                    <button type="submit" className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
                    Login
                    </button>
                    <div>
                    If you don't have an account, please 
                    <Link href="/signup" className="text-blue-500"> Signup</Link>
                </div>
                </form>
        </div>
    )
}