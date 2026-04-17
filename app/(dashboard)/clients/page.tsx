import { getClients } from "@/app/actions/clients";
import ClientsClient from "./ClientsClient";

export default async function ClientsPage() {
  const clients = await getClients();

  return <ClientsClient clients={clients} />;
}
