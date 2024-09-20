'use client'

import { Input } from "@/utils/Tags/Input";
import { createTable } from "@/utils/requests/Table";
import { register } from "@/utils/requests/User";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const router = useRouter();
    const handleRegister = async (e : React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const { username, email, password } = Object.fromEntries(new FormData(e.target as HTMLFormElement)) as {
            username: string,
            email: string,
            password: string
        };

        if (!username || !email || !password) {
            alert('Username, email and password are required');
            return;
        }

        if (password.length < 8) {
            alert('Password must be at least 8 characters');
            return;
        }

        const response = await register(username, email, password);
        localStorage.setItem('token', response.token);
        createTable("Default Board", response.user.id);
        router.push(`/${response.user.name}`);
    };

    return (
    <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="flex flex-col items-center bg-secondary-dark text-xl p-10 rounded-lg gap-5">
        <h1 className="text-3xl font-bold text-gray-200">TODO Next App</h1>
        <form action="" method="post" className="flex flex-col gap-2" onSubmit={handleRegister}>
            <label htmlFor="username" className="text-gray-400 font-bold text-sm">Name:</label>
            <Input type="text" id="username" name="username" />
            <label htmlFor="email" className="text-gray-400 font-bold text-sm">Email:</label>
            <Input type="email" id="email" name="email" />
            <label htmlFor="password" className="text-gray-400 font-bold text-sm">Password:</label>
            <Input type="password" id="password" name="password" /> 
            <button type="submit" className="bg-button font-bold text-base p-2 rounded mt-3">Register</button>
        </form>
        <button className="text-gray-400 font-bold text-sm" onClick={() => router.push('/login')}>Already have an account? Login</button>
        </div>
    </main>
    );
}
