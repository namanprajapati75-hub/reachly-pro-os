import { getAIInboxLeads } from "@/app/actions/aiHub";
import AIHubClient from "./AIHubClient";

export const dynamic = "force-dynamic";

export default async function AIHubPage() {
  const data = await getAIInboxLeads();

  return <AIHubClient initialData={data} />;
}
