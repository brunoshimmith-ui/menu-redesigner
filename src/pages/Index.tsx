import { useState } from "react";
import {
  Users,
  Globe,
  PlayCircle,
  LayoutDashboard,
  Settings,
  UserCog,
  ArrowUpDown,
  School,
  UserCircle,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MenuCard } from "@/components/MenuCard";
import { DropdownSelector } from "@/components/DropdownSelector";
import { UserProfile } from "@/components/UserProfile";

const menuItems = [
  { icon: Users, label: "Todas as Turmas", variant: "blue" as const },
  { icon: Globe, label: "Página Pública", variant: "orange" as const },
  { icon: PlayCircle, label: "Stepmeet", variant: "coral" as const },
  { icon: LayoutDashboard, label: "Dashboard", variant: "purple" as const },
  { icon: Settings, label: "Configurações", variant: "gray" as const },
  { icon: UserCog, label: "Usuários", variant: "blue" as const },
  { icon: ArrowUpDown, label: "Transferências", variant: "gray" as const },
];

const schoolOptions = ["SM-A(1)", "SM-B(2)", "SM-C(3)"];
const profileOptions = ["Suporte", "Administrador", "Gestor"];

const Index = () => {
  const [selectedSchool, setSelectedSchool] = useState("SM-A(1)");
  const [selectedProfile, setSelectedProfile] = useState("Suporte");

  return (
    <div className="min-h-screen flex flex-col bg-background bg-pattern">
      <Header />

      <main className="flex-1 px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
            {/* Left side - Profile and Menu */}
            <div className="flex-1 space-y-8">
              {/* User Profile */}
              <div className="animate-fade-in" style={{ animationDelay: "0ms" }}>
                <UserProfile
                  name="Gestor Maravilha Alagoas"
                  code="#SEME00001"
                />
              </div>

              {/* Menu Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {menuItems.map((item, index) => (
                  <div
                    key={item.label}
                    className="animate-fade-in"
                    style={{ animationDelay: `${(index + 1) * 100}ms` }}
                  >
                    <MenuCard
                      icon={item.icon}
                      label={item.label}
                      variant={item.variant}
                      onClick={() => console.log(`Clicked: ${item.label}`)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Selectors */}
            <div className="w-full lg:w-72 space-y-4">
              <div className="animate-fade-in" style={{ animationDelay: "200ms" }}>
                <DropdownSelector
                  icon={School}
                  label="Escola"
                  value={selectedSchool}
                  options={schoolOptions}
                  variant="green"
                  onSelect={setSelectedSchool}
                />
              </div>
              <div className="animate-fade-in" style={{ animationDelay: "300ms" }}>
                <DropdownSelector
                  icon={UserCircle}
                  label="Perfil"
                  value={selectedProfile}
                  options={profileOptions}
                  variant="coral"
                  onSelect={setSelectedProfile}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
