import { Card, CardContent } from "@/components/ui/card";
type PageHeaderProps = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
};


export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <Card className="mb-6 rounded-[10px] bg-[#FFFFF]">
      <CardContent className="flex items-center justify-between py-4">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </CardContent>
    </Card>
  );
}