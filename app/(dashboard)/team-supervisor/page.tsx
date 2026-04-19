import { getTeamProductivity } from "@/app/actions/aiHub";
import TeamSupervisorClient from "./TeamSupervisorClient";

export const dynamic = "force-dynamic";

export default async function TeamSupervisorPage() {
  const data = await getTeamProductivity();

  return (
    <TeamSupervisorClient initialData={data} />
  );
}
