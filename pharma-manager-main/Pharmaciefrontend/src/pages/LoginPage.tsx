import { LoginForm } from "@/components/Authentification/loginForm";


export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      
      <div className="w-full max-w-md">
        
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            💊 PharmaManager
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Connectez-vous à votre compte
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-md p-6">
          <LoginForm />
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          © {new Date().getFullYear()} PharmaManager
        </p>
      </div>
    </div>
  );
}