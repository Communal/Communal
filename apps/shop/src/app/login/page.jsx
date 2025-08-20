"use client";
import { Input } from "../../components/Input";
import Button from "../../components/Button";
import Link from "next/link";
import { useActionState } from "react";
import { handleLogin } from "../api/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import BackHome from "../../components/Home";
import { useUserStore } from "../../store/userStore"; // ✅ import the store

const initialState = {
  email: process.env.NODE_ENV === "development" ? "test@example.com" : "",
  password: process.env.NODE_ENV === "development" ? "password123" : "",
  error: "",
  success: "",
  token: "",
  user: null,
};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(
    handleLogin,
    initialState
  );

  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser); // ✅ get setter

  useEffect(() => {
    if (state?.success) {
      if (state.token) {
        localStorage.setItem("token", state.token);
      }

      if (state.user) {
        // ✅ store only id + token in zustand
        setUser({
          id: state.user.id,
          token: state.token,
        });
      }

      router.push("/");
    }
  }, [state?.success, state?.token, state?.user, router, setUser]);

  return (
    <div className="flex flex-col justify-center bg-background px-4 py-8">
      <BackHome />

      <div className="flex flex-col items-center mt-20">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Communal Shop
        </h1>
        <p className="text-lg text-foreground mb-6">
          Please Log in to start shopping
        </p>

        {state?.error && (
          <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {state.error}
          </div>
        )}

        {state?.success && (
          <div className="w-full bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {state.success}
          </div>
        )}

        <form className="w-full flex flex-col gap-4" action={formAction}>
          <Input
            type="text"
            name="email"
            placeholder="Email or Username"
            defaultValue={state?.email || ""}
            required
          />
          <div className="relative">
            <Input
              type="password"
              name="password"
              placeholder="Password"
              defaultValue={state?.password || ""}
              required
            />
            <Link
              href="#"
              className="absolute right-0 top-full mt-2 text-foreground text-sm underline font-semibold"
            >
              Forgot password?
            </Link>
          </div>
          <Button
            type="submit"
            className="button w-full mt-6"
            disabled={pending}
          >
            {pending ? "Logging in..." : "Log in"}
          </Button>
        </form>

        <p className="mt-8 text-center text-gray-700">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-foreground underline font-semibold"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
