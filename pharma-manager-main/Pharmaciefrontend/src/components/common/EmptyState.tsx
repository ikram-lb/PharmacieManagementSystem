import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

// Define props type
type EmptyStateProp = {
  message?: string; // optional message
};

// Component
function EmptyState({ message }: EmptyStateProp) {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader>
        <CardTitle>Empty</CardTitle>
      </CardHeader>

      <CardContent>
        <p>
          {message || "Aucune donnée disponible"}
        </p>
      </CardContent>
    </Card>
  );
}

export default EmptyState;