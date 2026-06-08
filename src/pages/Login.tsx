import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, MapPin } from "lucide-react";
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
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background:
          "linear-gradient(135deg, #1F245A 0%, #2D3478 40%, #4A54C9 100%)",
      }}
    >
      <div
        className="w-[380px] max-w-full rounded-[20px] p-10 text-white shadow-2xl animate-fade-in"
        style={{
          background: "rgba(255,255,255,0.08)",
          backdropFilter: "blur(15px)",
          WebkitBackdropFilter: "blur(15px)",
          boxShadow: "0 15px 35px rgba(0,0,0,0.25)",
        }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-wide">LOGIN</h1>
          <p className="text-white/70 text-xs mt-2">Sistema Educacional Municipal — SEMED</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="municipio" className="text-white flex items-center gap-1.5 text-sm">
              <MapPin className="w-3.5 h-3.5" />
              Canal (município)
            </Label>
            <select
              id="municipio"
              value={municipio.id}
              onChange={(e) => setMunicipio(e.target.value as typeof municipio.id)}
              className="w-full h-[46px] rounded-[10px] border-0 px-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white/40"
              style={{ background: "rgba(255,255,255,0.15)" }}
            >
              {municipios.map((m) => (
                <option key={m.id} value={m.id} className="text-slate-800">
                  {m.nome} — {m.uf}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username" className="text-white text-sm">Usuário</Label>
            <Input
              id="username"
              type="text"
              placeholder="Digite seu usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="h-[46px] rounded-[10px] border-0 text-white placeholder:text-white/70 focus-visible:ring-2 focus-visible:ring-white/40"
              style={{ background: "rgba(255,255,255,0.15)" }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white text-sm">Senha</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-[46px] rounded-[10px] border-0 text-white placeholder:text-white/70 pr-10 focus-visible:ring-2 focus-visible:ring-white/40"
                style={{ background: "rgba(255,255,255,0.15)" }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/80 hover:text-white transition-colors"
                aria-label="Mostrar senha"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-[46px] rounded-[10px] text-white border-0 font-bold text-base hover:-translate-y-0.5 transition-transform"
            style={{
              background: "linear-gradient(90deg, #6C63FF, #8B5CF6)",
            }}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Entrar"
            )}
          </Button>

          <div className="text-center mt-5">
            <a href="#" className="text-[#D8D5FF] text-sm hover:underline">
              Esqueci minha senha
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
