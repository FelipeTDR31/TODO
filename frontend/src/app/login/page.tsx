'use client'

import { Input } from "@/utils/Tags/Input";
import { login } from "@/utils/requests/User";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  async function handleLogin(e : React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const response = await login(email, password);
    localStorage.setItem('token', response.token);
    router.push(`/${response.foundUser.name}`);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center bg-secondary-dark text-xl p-10 rounded-lg gap-5">
        <h1 className="text-3xl font-bold text-gray-200">TODO Next App</h1>
        <form action="" method="post" className="flex flex-col gap-2" onSubmit={handleLogin}>
          <label htmlFor="email" className="text-gray-400 font-bold text-sm">Email:</label>
          <Input type="email" id="email" name="email" />
          <label htmlFor="password" className="text-gray-400 font-bold text-sm">Password:</label>
          <Input type="password" id="password" name="password" /> 
          <button type="submit" className="bg-button font-bold text-base p-2 rounded mt-3">Login</button>
        </form>
        <button className="text-gray-400 font-bold text-sm" onClick={() => router.push('/register')}>Don&apos;t have an account? Sign Up</button>
      </div>
    </main>
  );
}
