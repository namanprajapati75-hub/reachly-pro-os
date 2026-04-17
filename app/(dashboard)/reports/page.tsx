import { getReports } from "@/app/actions/reports";
import { getClients } from "@/app/actions/clients";
import ReportsClient from "./ReportsClient";

export default async function ReportsPage() {
  const [reports, clients] = await Promise.all([
    getReports(),
    getClients()
  ]);

  return <ReportsClient reports={reports} clients={clients} />;
}
