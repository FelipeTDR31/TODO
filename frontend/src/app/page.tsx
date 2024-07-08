import { Input } from "@/utils/Tags/Input";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="flex flex-col items-center bg-secondary text-xl p-10 rounded-lg gap-5">
        <h1 className="text-3xl font-bold text-gray-200">TODO Next App</h1>
        <form action="" method="post" className="flex flex-col gap-2">
          <label htmlFor="email" className="text-gray-400 font-bold text-sm">Email:</label>
          <Input type="email" id="email" name="email" />
          <label htmlFor="password" className="text-gray-400 font-bold text-sm">Password:</label>
          <Input type="password" id="password" name="password" /> 
          <button type="submit" className="bg-button font-bold text-base p-2 rounded mt-3">Login</button>
        </form>
        <button className="text-gray-400 font-bold text-sm">Don't have an account? Sign Up</button>
      </div>
    </main>
  );
}
