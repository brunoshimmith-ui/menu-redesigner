import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Eye, EyeOff, LogIn, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMunicipio } from "@/hooks/use-municipio";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { municipio, municipios, setMunicipio } = useMunicipio();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      const success = login(username, password);
      if (success) {
        toast({ title: "Bem-vindo!", description: `Acessando canal: ${municipio.nome}/${municipio.uf}` });
        navigate("/menu");
      } else {
        toast({
          title: "Erro de autenticação",
          description: "Usuário ou senha incorretos.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden bg-[hsl(var(--edu-purple))]">
      {/* Gradiente do sistema: ROXO → LARANJA → AZUL */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--edu-purple)) 0%, hsl(var(--edu-orange)) 55%, hsl(var(--edu-blue)) 100%)",
        }}
      />
      {/* Blobs luminosos para profundidade */}
      <div aria-hidden className="absolute -top-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-50"
        style={{ background: "hsl(var(--edu-purple))" }} />
      <div aria-hidden className="absolute top-1/3 -right-32 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-50"
        style={{ background: "hsl(var(--edu-orange))" }} />
      <div aria-hidden className="absolute -bottom-40 left-1/3 w-[32rem] h-[32rem] rounded-full blur-3xl opacity-50"
        style={{ background: "hsl(var(--edu-blue))" }} />

      <Card className="relative w-full max-w-md shadow-2xl animate-fade-in backdrop-blur-sm bg-card/95 border-white/20">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div
              className="flex items-center justify-center w-16 h-16 rounded-2xl shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg, hsl(var(--edu-purple)), hsl(var(--edu-orange)), hsl(var(--edu-blue)))",
              }}
            >
              <GraduationCap className="w-9 h-9 text-white" />
            </div>
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">SEMED</CardTitle>
            <CardDescription className="text-muted-foreground">
              Sistema Educacional Municipal
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Seletor de canal/município */}
            <div className="space-y-2">
              <Label htmlFor="municipio" className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-edu-orange" />
                Canal de acesso (município)
              </Label>
              <select
                id="municipio"
                value={municipio.id}
                onChange={(e) => setMunicipio(e.target.value as typeof municipio.id)}
                className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {municipios.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nome} — {m.uf}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <Input
                id="username"
                type="text"
                placeholder="Digite seu usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 gap-2 text-white border-0 hover:opacity-90"
              style={{
                background:
                  "linear-gradient(135deg, hsl(var(--edu-purple)), hsl(var(--edu-orange)), hsl(var(--edu-blue)))",
              }}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              Entrar
            </Button>
          </form>
          <div className="mt-5 p-3 rounded-md bg-muted/40 border border-border">
            <p className="text-[11px] text-muted-foreground text-center">
              Suporte pode trocar de perfil e de município pelo cabeçalho, após entrar.
            </p>
          </div>
          <p className="text-xs text-muted-foreground text-center mt-4">
            © 2026 Sistema Educacional. Todos os direitos reservados.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
