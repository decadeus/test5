import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "./submit-button";

export default function Login({ searchParams }: { searchParams: { message: string } }) {
  
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/");
  };

  const signUp = async (formData: FormData) => {
    "use server";

    const origin = headers().get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = createClient();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/login?message=Check your email to continue the sign-in process");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form className="flex flex-col gap-4 p-8 bg-white border border-gray-300 rounded-lg shadow-md max-w-sm w-full">
        <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">Login</h1>
        
        <label className="text-sm font-medium text-gray-600" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-lg px-4 py-2 border border-gray-300 focus:ring focus:ring-green-200 focus:outline-none"
          type="email"
          name="email"
          id="email"
          placeholder="you@example.com"
          required
        />
        
        <label className="text-sm font-medium text-gray-600" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-lg px-4 py-2 border border-gray-300 focus:ring focus:ring-green-200 focus:outline-none"
          type="password"
          name="password"
          id="password"
          placeholder="••••••••"
          required
        />

        <SubmitButton
          formAction={signIn}
          className="bgmap text-white rounded-lg px-4 py-2 hover:bg-green-700 transition mb-4"
          pendingText="Signing In..."
        >
          Sign In
        </SubmitButton>

        {/* Uncomment if sign-up functionality is needed */}
        {/* <SubmitButton
          formAction={signUp}
          className="bg-gray-200 text-gray-700 rounded-lg px-4 py-2 hover:bg-gray-300 transition"
          pendingText="Signing Up..."
        >
          Sign Up
        </SubmitButton> */}

        {searchParams?.message && (
          <p className="mt-4 p-3 bg-red-100 text-red-700 text-center rounded-md">
            {searchParams.message}
          </p>
        )}

        <p className="text-center text-sm text-gray-500 mt-4">
          Don't have an account?{" "}
          <Link href="/signup" className="text-green-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}
