import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SocialButtonProps {
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export function SocialButton({ label, icon, onClick }: SocialButtonProps) {
  return (
    <Button
      type="button"
      variant="secondary"
      className="w-full justify-between border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      onClick={onClick}
    >
      <span className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </span>
      <ArrowRight className="h-4 w-4" />
    </Button>
  );
}
