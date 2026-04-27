import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";

type ErrorAlertProps = {
  message?: string;
};

function ErrorAlert({ message }: ErrorAlertProps) {
  if (!message) return null;

  return (
    <Alert variant="destructive">
      <AlertTitle>Erreur</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

export default ErrorAlert;