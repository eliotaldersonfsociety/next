import { LoginForm } from "./signup/page";

export default function LoginPage() {
  return (
    <>
      {/* Aquí puedes mantener el Header fuera del contenedor */}
      <Header />
      
      <div className="flex flex-col items-center justify-center min-h-screen bg-muted p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-3xl">
          <LoginForm />
        </div>
      </div>

      {/* Aquí puedes mantener el Footer fuera del contenedor */}
      <Footer />
    </>
  );
}
