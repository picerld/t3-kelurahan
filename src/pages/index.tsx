import { HeadMetaData } from "@/components/meta/HeadMetaData";
import { AuthContainer } from "@/features/auth/components";
import { LoginForm } from "@/features/auth/login/components/LoginForm";

export default function AuthLoginFormPage() {
  return (
    <AuthContainer mode="signin">
      <HeadMetaData title="Sign In" pathName="/" />
      <LoginForm />
    </AuthContainer>
  )
}
