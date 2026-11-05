import { LoginForm } from "@/features/login";
import { AuthLayout } from "@/widgets/auth-layout";

export function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
