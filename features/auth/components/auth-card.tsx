import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function AuthCard({ title, description, children, footer, className }: AuthCardProps) {
  return (
    <Card className={cn("w-full max-w-md border-slate-200/80 bg-white/95 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.25)]", className)}>
      <CardHeader className="space-y-3">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer ? <CardFooter className="justify-center border-t border-slate-100 pt-6">{footer}</CardFooter> : null}
    </Card>
  );
}
