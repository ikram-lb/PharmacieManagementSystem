import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
     const { login } = useAuth();
      const [username, setUsername] = useState("");
      const [password, setPassword] = useState("");
    //   const [showPassword, setShowPassword] = useState(false);
      const [error, setError] = useState<string | null>(null);
      const [loading, setLoading] = useState(false);
      const navigate = useNavigate();
    
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
    
        if (!username.trim() || !password.trim()) {
          setError("Veuillez remplir tous les champs.");
          toast.error("Veuillez remplir tous les champs")
          return;
        }
    
        setLoading(true);

        try {
      await login(username.trim(), password);
      toast.success("Connexion reussie")
      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 401) {
        setError("Identifiant ou mot de passe incorrect.");
        toast.error("Identifiant ou mot de passe incorrect.")
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Username</FieldLabel>
                <Input
                  id="username"
                  type="text"
                  placeholder="Your name"
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                </div>
                <Input id="password" 
                       type="Password"
                       required
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       disabled={loading} />
              </Field>
              <Field>
              <Button type="submit" disabled={loading}>
             {loading ? "Connexion..." : "Login"}
            </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
