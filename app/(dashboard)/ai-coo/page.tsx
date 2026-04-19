import { getAICOOBriefing } from "@/app/actions/aiHub";
import AICooClient from "./AICooClient";

export const dynamic = "force-dynamic";

export default async function AICooPage() {
  const briefingData = await getAICOOBriefing();

  return (
    <AICooClient initialData={briefingData} />
  );
}
