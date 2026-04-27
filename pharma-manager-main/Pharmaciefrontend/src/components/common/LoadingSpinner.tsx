
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";

type LoadingSpinnerProps = {
  message?: string;
};

export default function LoadingSpinner({
  message = "Chargement...",
}: LoadingSpinnerProps) {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardContent className="flex flex-col items-center justify-center gap-3 py-6">
        
        <Skeleton className="h-4 w-full" />
        
        <p className="text-sm text-muted-foreground">{message}</p>
      </CardContent>
    </Card>
  );
}