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
  const [remember, setRemember] = useState(false);
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
      className="relative min-h-screen flex items-center justify-center p-4 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0a1f4d 0%, #0a1838 45%, #07152c 100%)",
      }}
    >
      {/* Glass card */}
      <div
        className="relative w-full max-w-md rounded-2xl overflow-hidden border border-white/10 shadow-2xl animate-fade-in backdrop-blur-xl"
        style={{
          background:
            "linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 60%, rgba(255,255,255,0.06) 100%)",
        }}
      >
        {/* Header com gradiente */}
        <div
          className="px-6 py-5 text-center border-b border-white/10"
          style={{
            background:
              "linear-gradient(135deg, #0a1f4d 0%, #122a66 50%, #07152c 100%)",
          }}
        >
          <h1 className="text-white text-xl font-semibold tracking-wide">
            Iniciar sessão
          </h1>
          <p className="text-white/70 text-xs mt-1">
            Sistema Educacional Municipal — SEMED
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-7 space-y-5">
          {/* Município */}
          <div className="space-y-2">
            <Label htmlFor="municipio" className="text-white/80 flex items-center gap-1.5 text-xs uppercase tracking-wider">
              <MapPin className="w-3.5 h-3.5" />
              Canal (município)
            </Label>
            <select
              id="municipio"
              value={municipio.id}
              onChange={(e) => setMunicipio(e.target.value as typeof municipio.id)}
              className="flex h-11 w-full rounded-full border border-white/20 bg-white/95 text-slate-800 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-white/40"
            >
              {municipios.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nome} — {m.uf}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Input
              id="username"
              type="text"
              placeholder="USUÁRIO"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="h-11 rounded-full bg-white/95 text-slate-800 placeholder:text-slate-500 placeholder:tracking-wider text-center border-0 focus-visible:ring-2 focus-visible:ring-white/40"
            />
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="SENHA"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 rounded-full bg-white/95 text-slate-800 placeholder:text-slate-500 placeholder:tracking-wider text-center border-0 pr-10 pl-10 focus-visible:ring-2 focus-visible:ring-white/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-800 transition-colors"
                aria-label="Mostrar senha"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <label className="flex items-center justify-end gap-2 text-[11px] text-white/70 pr-2">
              lembrar senha
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-3.5 h-3.5 rounded accent-white"
              />
            </label>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-full text-white border-0 hover:opacity-95 transition-opacity font-semibold tracking-wide"
            style={{
              background:
                "linear-gradient(135deg, #122a66 0%, #0a1f4d 50%, #07152c 100%)",
            }}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              "Iniciar"
            )}
          </Button>

          <p className="text-[11px] text-white/60 text-center">
            © 2026 Sistema Educacional. Todos os direitos reservados.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
