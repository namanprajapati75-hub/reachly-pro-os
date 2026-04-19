import { prisma } from "./prisma";

/**
 * AI-powered Task Generation Logic
 */

export async function generateOnboardingTasks(clientId: string, clientName: string) {
  const onboardingTasks = [
    { title: `Intro call with ${clientName}`, priority: 'High', description: 'Schedule a 30min kick-off call to align on Q1 goals.' },
    { title: `Collect assets/logo from ${clientName}`, priority: 'Medium', description: 'Request high-res logos, brand guidelines, and existing ad assets.' },
    { title: `Setup campaign structure`, priority: 'High', description: 'Create initial campaign buckets in the ad manager.' },
    { title: `Schedule first report date`, priority: 'Medium', description: 'Set a recurring calendar invite for the monthly growth report.' },
    { title: `Gather access credentials`, priority: 'Urgent', description: 'Request access to Meta Business Suite and Google Ads.' },
  ];

  try {
    const tasks = await Promise.all(
      onboardingTasks.map(task => 
        prisma.task.create({
          data: {
            ...task,
            clientId,
            status: 'Open',
            dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
          }
        })
      )
    );
    return { success: true, count: tasks.length };
  } catch (error) {
    console.error("Task Generation Error:", error);
    return { success: false, error };
  }
}

export async function generateWonLeadTasks(leadId: string, leadName: string, company: string | null) {
  const wonTasks = [
    { title: `Draft contract for ${leadName}`, priority: 'Urgent', description: 'Prepare the standard service agreement with agreed pricing.' },
    { title: `Send invoice to ${company || leadName}`, priority: 'Urgent', description: 'Generate first month retainer invoice.' },
    { title: `Create project in PM tool`, priority: 'Medium', description: 'Setup the client project and invite team members.' },
  ];

  try {
    // Note: Won leads might not have a clientId yet if we haven't converted them.
    // In our system, 'Won' leads are typically converted to clients.
    const tasks = await Promise.all(
      wonTasks.map(task => 
        prisma.task.create({
          data: {
            ...task,
            status: 'Open',
            dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
          }
        })
      )
    );
    return { success: true, count: tasks.length };
  } catch (error) {
    console.error("Won Lead Task Generation Error:", error);
    return { success: false, error };
  }
}
