"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTasks() {
  try {
    return await prisma.task.findMany({
      include: { client: true },
      orderBy: [
        { priority: "desc" }, // We'll need better logic for custom sorting, but this is a start
        { dueDate: "asc" },
      ],
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}

export async function createTask(data: any) {
  try {
    const task = await prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority || "Medium",
        status: data.status || "Open",
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        clientId: data.clientId,
      },
    });
    revalidatePath("/tasks");
    return { success: true, task };
  } catch (error) {
    console.error("Error creating task:", error);
    return { success: false, error: "Failed to create task" };
  }
}

export async function updateTask(id: string, data: any) {
  try {
    const task = await prisma.task.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority,
        status: data.status,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        clientId: data.clientId,
      },
    });
    revalidatePath("/tasks");
    revalidatePath("/"); // Dashboard widgets
    return { success: true, task };
  } catch (error) {
    console.error("Error updating task:", error);
    return { success: false, error: "Failed to update task" };
  }
}

export async function deleteTask(id: string) {
  try {
    await prisma.task.delete({
      where: { id },
    });
    revalidatePath("/tasks");
    return { success: true };
  } catch (error) {
    console.error("Error deleting task:", error);
    return { success: false, error: "Failed to delete task" };
  }
}
