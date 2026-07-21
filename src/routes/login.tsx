import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { API_URL } from "@/lib/api/client";
import { apiError } from "@/lib/api/client";

const schema = z.object({
  identifier: z.string().min(1, "Required"),
  password: z.string().min(6, "Min 6 characters"),
});
type FormData = z.infer<typeof schema>;

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>) => ({
    next: typeof s.next === "string" ? s.next : undefined,
  }),
  head: () => ({ meta: [{ title: "Log in — Cardify" }] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/login" });
  const login = useAuthStore((s) => s.login);
  const loading = useAuthStore((s) => s.loading);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await login(data.identifier, data.password);
      toast.success("Welcome back");
      navigate({ to: search.next ?? "/dashboard" });
    } catch (e) {
      toast.error(apiError(e));
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-sidebar p-10 text-sidebar-foreground">
        <Link to="/" className="font-display text-xl font-semibold">
          Cardify
        </Link>
        <div>
          <div className="font-display text-3xl font-semibold leading-tight">
            One canvas engine.<br />Every brand surface.
          </div>
          <div className="mt-3 text-sm text-sidebar-foreground/70">
            Cards, QR pages, sites — all from the same JSON.
          </div>
        </div>
        <div className="text-xs text-sidebar-foreground/50">© Cardify</div>
      </div>
      <div className="flex items-center justify-center p-6 lg:p-12">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-5">
          <div>
            <h1 className="font-display text-3xl font-bold">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Log in to your Cardify account.
            </p>
          </div>
          <div className="space-y-2">
            <Label>Email or username</Label>
            <Input type="text" placeholder="you@example.com or username" {...register("identifier")} />
            {errors.identifier && <p className="text-xs text-destructive">{errors.identifier.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" placeholder="••••••••" {...register("password")} />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
          <a href={`${API_URL}/auth/google`} className="block">
            <Button type="button" variant="outline" className="w-full">
              Continue with Google
            </Button>
          </a>
          <div className="text-center text-sm text-muted-foreground">
            No account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Create one
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
