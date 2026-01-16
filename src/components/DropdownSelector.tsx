import { ChevronDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DropdownSelectorProps {
  icon: LucideIcon;
  label: string;
  value: string;
  options: string[];
  variant?: "green" | "coral" | "purple" | "blue";
  onSelect?: (value: string) => void;
}

const variantStyles = {
  green: {
    bg: "bg-edu-green-light",
    icon: "text-edu-green",
    value: "text-edu-green",
  },
  coral: {
    bg: "bg-edu-coral-light",
    icon: "text-edu-coral",
    value: "text-edu-coral",
  },
  purple: {
    bg: "bg-edu-purple-light",
    icon: "text-edu-purple",
    value: "text-edu-purple",
  },
  blue: {
    bg: "bg-edu-blue-light",
    icon: "text-edu-blue",
    value: "text-edu-blue",
  },
};

export function DropdownSelector({
  icon: Icon,
  label,
  value,
  options,
  variant = "green",
  onSelect,
}: DropdownSelectorProps) {
  const styles = variantStyles[variant];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="dropdown-selector w-full">
          <div className={cn("menu-icon-wrapper flex-shrink-0", styles.bg)}>
            <Icon className={cn("w-5 h-5", styles.icon)} />
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-xs text-muted-foreground">{label}:</span>
            <div className="flex items-center gap-1">
              <span className={cn("text-sm font-medium truncate", styles.value)}>
                {value}
              </span>
              <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            </div>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {options.map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => onSelect?.(option)}
            className={cn(option === value && "bg-muted")}
          >
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
