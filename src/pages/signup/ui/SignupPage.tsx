import { SignupForm } from "@/features/signup";
import { AuthLayout } from "@/widgets/auth-layout";

export function SignupPage() {
  return (
    <AuthLayout>
      <SignupForm />
    </AuthLayout>
  );
}
