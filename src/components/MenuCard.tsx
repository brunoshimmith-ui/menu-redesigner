import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MenuCardProps {
  icon: LucideIcon;
  label: string;
  variant?: "green" | "coral" | "purple" | "blue" | "orange" | "gray";
  onClick?: () => void;
}

const variantStyles = {
  green: {
    bg: "bg-edu-green-light",
    icon: "text-edu-green",
  },
  coral: {
    bg: "bg-edu-coral-light",
    icon: "text-edu-coral",
  },
  purple: {
    bg: "bg-edu-purple-light",
    icon: "text-edu-purple",
  },
  blue: {
    bg: "bg-edu-blue-light",
    icon: "text-edu-blue",
  },
  orange: {
    bg: "bg-edu-orange-light",
    icon: "text-edu-orange",
  },
  gray: {
    bg: "bg-edu-gray-light",
    icon: "text-edu-gray",
  },
};

export function MenuCard({ icon: Icon, label, variant = "green", onClick }: MenuCardProps) {
  const styles = variantStyles[variant];

  return (
    <button
      onClick={onClick}
      className="menu-card group w-full text-left"
    >
      <div className={cn("menu-icon-wrapper", styles.bg)}>
        <Icon className={cn("w-5 h-5", styles.icon)} />
      </div>
      <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
        {label}
      </span>
    </button>
  );
}
