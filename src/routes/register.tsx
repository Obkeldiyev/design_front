import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth";
import { toast } from "sonner";
import { API_URL, apiError } from "@/lib/api/client";

const schema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Min 8 characters"),
});
type FormData = z.infer<typeof schema>;

export const Route = createFileRoute("/register")({
  head: () => ({ meta: [{ title: "Create account — Cardify" }] }),
  component: Register,
});

function Register() {
  const navigate = useNavigate();
  const registerUser = useAuthStore((s) => s.register);
  const loading = useAuthStore((s) => s.loading);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await registerUser(data);
      toast.success("Account created");
      navigate({ to: "/dashboard" });
    } catch (e) {
      toast.error(apiError(e));
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center p-6 lg:p-12">
        <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm space-y-5">
          <div>
            <h1 className="font-display text-3xl font-bold">Create your account</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              60 seconds. No credit card.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>First name</Label>
              <Input {...register("firstName")} />
              {errors.firstName && (
                <p className="text-xs text-destructive">{errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Last name</Label>
              <Input {...register("lastName")} />
              {errors.lastName && (
                <p className="text-xs text-destructive">{errors.lastName.message}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" {...register("email")} />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" {...register("password")} />
            {errors.password && (
              <p className="text-xs text-destructive">{errors.password.message}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </Button>
          <a href={`${API_URL}/auth/google`} className="block">
            <Button type="button" variant="outline" className="w-full">
              Continue with Google
            </Button>
          </a>
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Log in
            </Link>
          </div>
        </form>
      </div>
      <div className="hidden lg:flex flex-col justify-between bg-sidebar p-10 text-sidebar-foreground">
        <div />
        <div>
          <div className="font-display text-3xl font-semibold leading-tight">
            Built for entrepreneurs<br />who don't have time to design.
          </div>
        </div>
        <div className="text-xs text-sidebar-foreground/50">© Cardify</div>
      </div>
    </div>
  );
}
