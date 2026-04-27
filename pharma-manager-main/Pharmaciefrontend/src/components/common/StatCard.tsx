import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


type StatCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  variant?: "default" | "destructive" | "warning";
};

function StatCard({ title, value, description, icon, variant = "default" }: StatCardProps) {
  return (
    <Card className=" w-72 bg-gray-100 shadow p-4 space-y-2 rounded-md hover:-translate-y-2 duration-300">
      <CardHeader className="flex flex-row items-center justify-between p-0" >
        <div className="flex items-center gap-2">
         <div
          className={[
            "p-2 rounded-md",
            variant === "destructive"
              ? "text-destructive bg-destructive/10"
              : variant === "warning"
              ? "text-yellow-500 bg-yellow-100"
              : "text-primary bg-primary/10",
          ].join(" ")}
        >
          {icon}
        </div>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        </div>
        
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">{value}</p>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default StatCard;