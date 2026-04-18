import { getTasks } from "@/app/actions/tasks";
import { getClients } from "@/app/actions/clients";
import TasksClient from "./TasksClient";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const [tasks, clients] = await Promise.all([
    getTasks(),
    getClients()
  ]);

  return <TasksClient tasks={tasks} clients={clients} />;
}
