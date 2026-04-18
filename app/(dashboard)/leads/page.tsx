import { getLeads } from "@/app/actions/leads";
import { getClients } from "@/app/actions/clients";
import LeadsClient from "./LeadsClient";

export default async function LeadsPage() {
  const [leads, clients] = await Promise.all([
    getLeads(),
    getClients()
  ]);

  return <LeadsClient leads={leads} clients={clients} />;
}
