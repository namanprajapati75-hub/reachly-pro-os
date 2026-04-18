import { NextResponse } from 'next/server';
import { createLead } from '@/app/actions/leads';
import { prisma } from '@/lib/prisma';
import { logSystemActivity } from '@/lib/activityLogger';

// For incoming webhook integrations (Zapier, Meta, Forms)
export async function POST(req: Request) {
  try {
    // 1. Verify Authentication 
    const authHeader = req.headers.get('authorization');
    const webhookSecret = process.env.WEBHOOK_SECRET;

    if (process.env.NODE_ENV === 'production' && webhookSecret) {
      if (authHeader !== `Bearer ${webhookSecret}`) {
        await logSystemActivity({
          type: "SYSTEM",
          content: "Unauthorized webhook attempt blocked.",
        });
        return new NextResponse("Unauthorized", { status: 401 });
      }
    }

    // 2. Parse payload flexibly
    const payload = await req.json();

    // Mapping logic to handle various formats (e.g. Meta vs standard body)
    // Assume basic mapping for simplicity, falling back to JSON fields
    const name = payload.name || payload.full_name || "Unknown Lead";
    const email = payload.email || "";
    const phone = payload.phone || payload.phone_number || "";
    const company = payload.company || "";
    const source = payload.source || payload.lead_source || "API Webhook";
    const rawData = payload; // Can be stored if we add a json column in the schema

    // We need to look up a generic Client Id, or it's unassigned initially
    // For this boilerplate, assign null
    
    const leadData = {
      name,
      email,
      phone,
      company,
      source,
      status: "New",
      notes: `Captured via Automated Webhook.\n\nRaw Payload: ${JSON.stringify(rawData)}`,
      assignedClientId: null 
    };

    const res = await createLead(leadData);

    if (res.success && res.lead) {
      // logSystemActivity is already triggered inside `createLead` for LEAD_CAPTURED
      return NextResponse.json({ success: true, leadId: res.lead.id });
    } else {
      throw new Error(res.error || "Failed to create lead during webhook processing");
    }

  } catch (error: any) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
