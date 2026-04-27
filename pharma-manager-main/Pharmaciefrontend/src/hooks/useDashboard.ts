import { useQueries } from "@tanstack/react-query";
import { fetchMedicaments,fetchMedicamentAlerts } from "../api/medicamentApi";
import { fetchVentes } from "../api/ventesApi";


export const useDashboard = () => {
  const results = useQueries({
    queries: [
      {
        queryKey: ["medicaments"],
        queryFn: fetchMedicaments,
      },
      {
        queryKey: ["ventes"],
        queryFn: fetchVentes,
      },
      {
        queryKey: ["alerts"],
        queryFn: fetchMedicamentAlerts,
      },
    ],
  });

  const [medicamentsQuery, ventesQuery, alertsQuery] = results;

  return {
    medicaments: medicamentsQuery.data,
    ventes: ventesQuery.data,
    alerts: alertsQuery.data,

    isLoading: results.some((q) => q.isLoading),
    error: results.find((q) => q.error)?.error,
  };
};