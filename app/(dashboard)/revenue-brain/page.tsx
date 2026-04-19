import { getRevenueIntelligence } from "@/app/actions/aiHub";
import RevenueBrainClient from "./RevenueBrainClient";

export const dynamic = "force-dynamic";

export default async function RevenueBrainPage() {
  const data = await getRevenueIntelligence();

  return (
    <RevenueBrainClient initialData={data} />
  );
}
