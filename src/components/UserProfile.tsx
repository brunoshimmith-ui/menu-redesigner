import { Building2 } from "lucide-react";

interface UserProfileProps {
  name: string;
  code: string;
}

export function UserProfile({ name, code }: UserProfileProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center justify-center w-20 h-20 bg-primary rounded-xl shadow-lg">
        <Building2 className="w-10 h-10 text-primary-foreground" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-foreground">{name}</h2>
        <p className="text-sm text-primary font-medium">{code}</p>
      </div>
    </div>
  );
}
