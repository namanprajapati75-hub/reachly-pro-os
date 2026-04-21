Start the FINAL BOSS AI Upgrade for Reachly Pro OS.

Goal:
Transform Reachly from a working CRM into an AI-run Agency Operating System where the founder does minimal manual work and AI handles operations, priorities, growth suggestions, and execution support.

IMPORTANT:
Build this in clean serial phases inside the same project.
Use existing Supabase + Prisma + current UI.
Keep premium dark SaaS design.
Production-ready only.
No fake placeholders.
Every module must be functional and connected to real data.

==================================================
PHASE 1 — AI Operations Manager (COO Assistant)
==================================================

Build a new dashboard intelligence panel called "AI COO".

Every day automatically generate a founder briefing using real app data.

Show:

1. Urgent Tasks Pending
2. Overdue Tasks
3. Hot Leads Likely to Close
4. Leads Ignored Too Long
5. Client Risks (low activity / low CSAT / overdue reports)
6. Reports Due Soon
7. Revenue Opportunities
8. Top 5 Recommended Actions Today

Examples:
- 3 urgent tasks pending
- 2 leads likely to close today
- 1 client at churn risk
- 1 report due this week

Add button:
"Refresh AI Briefing"

==================================================
PHASE 2 — AI Auto Task Generator
==================================================

When a new client is created, AI automatically generates onboarding tasks.

Examples:
- Intro call
- Collect logo/assets
- Gather access credentials
- Setup campaign
- Create content calendar
- Schedule first report

When a new lead becomes Won:
- Create onboarding workflow tasks automatically.

When task backlog becomes high:
- Suggest task delegation.

==================================================
PHASE 3 — AI Lead Closer Assistant
==================================================

Inside Leads and AI Hub pages add AI Sales Assistant.

For each lead provide:

1. Suggested reply message
2. Best offer suggestion
3. Follow-up timing recommendation
4. Objection handling replies:
- Too expensive
- Need time
- Already have agency
- Not interested

5. Lead close probability score

6. Recommended next action:
- call now
- send case study
- offer discount
- book meeting

==================================================
PHASE 4 — AI Content Manager
==================================================

For every client generate content ideas based on business type.

Examples:
- 10 reel ideas
- ad copy variations
- hooks
- promotional offers
- festival campaigns
- local awareness content

Add:
"Generate Content Ideas" button inside client profile.

==================================================
PHASE 5 — AI Revenue Brain
==================================================

Build a Revenue Intelligence page.

Show:

1. Clients ready for upsell
2. Highest value leads
3. Clients likely to churn
4. Untapped revenue opportunities
5. Monthly forecast
6. Revenue leaks (ignored leads / overdue followups)

Examples:
- Gym client ready for Website upsell
- Dentist lead high close probability
- Restaurant client inactive 18 days

==================================================
PHASE 6 — AI Team Supervisor
==================================================

Track team productivity.

Show:

1. Editor pending tasks
2. Sales pending followups
3. Missed deadlines
4. Completed tasks leaderboard
5. Slow response warnings

Send internal notifications.

==================================================
PHASE 7 — One Click Autopilot Dashboard
==================================================

Add premium hero button:

"Run My Agency Today"

When clicked generate:

1. Today's priorities
2. Who to contact
3. Tasks to finish
4. Revenue opportunities
5. Team bottlenecks
6. Client alerts
7. Suggested founder focus for today

==================================================
UX REQUIREMENTS
==================================================

- Beautiful premium UI
- Fast loading
- Use charts/cards/widgets
- Mobile responsive
- Keep current Reachly branding
- Add smooth animations
- No broken routes
- No dead buttons

==================================================
TECH REQUIREMENTS
==================================================

- Use real database data where available
- Add sensible fallback demo insights if data is low
- Clean code structure
- Scalable architecture
- Build and deploy successfully

==================================================
FINAL DELIVERABLE
==================================================

Implement serially phase by phase.
After each phase ensure build passes.
Push stable updates only.
Reachly should feel like a billionaire founder’s AI control room."use client";

import React, { useState } from 'react';
import { Users, Plus, ExternalLink, Edit2, Search } from "lucide-react";
import Link from "next/link";
import PremiumEmptyState from "@/app/components/ui/PremiumEmptyState";
import ClientModal from "@/app/components/features/clients/ClientModal";

interface ClientsClientProps {
  clients: any[];
}

export default function ClientsClient({ clients }: ClientsClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    setSelectedClient(null);
    setIsModalOpen(true);
  };

  const handleEdit = (client: any) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-md)' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-muted)' }}>Portfolio</h2>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-outfit)' }}>Client Partners</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 1rem', borderRadius: '12px' }}>
            <Search size={16} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search clients..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: 'none', border: 'none', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
            />
          </div>
          <button onClick={handleCreate} className="glass btn-hover" style={{ 
            background: 'var(--primary)', color: '#000', border: 'none', 
            padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 800,
            display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'
          }}>
            <Plus size={18} />
            Add Client
          </button>
        </div>
      </header>

      {filteredClients.length > 0 ? (
        <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '1.25rem 2rem', fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Client Name</th>
                <th style={{ padding: '1.25rem 2rem', fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Company</th>
                <th style={{ padding: '1.25rem 2rem', fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Revenue</th>
                <th style={{ padding: '1.25rem 2rem', fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '1.25rem 2rem', fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((client) => (
                <tr key={client.id} className="table-row card-hover" style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1.25rem 2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ 
                        width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--primary)'
                      }}>
                        {client.name.charAt(0)}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 700 }}>{client.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{client.email}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 2rem', fontWeight: 600, color: 'var(--text-muted)' }}>{client.company}</td>
                  <td style={{ padding: '1.25rem 2rem', fontWeight: 800 }}>${client.revenue.toLocaleString()}</td>
                  <td style={{ padding: '1.25rem 2rem' }}>
                    <span style={{ 
                      padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800,
                      background: client.status === 'Archived' ? 'rgba(255,255,255,0.05)' : 'rgba(34, 197, 94, 0.1)', 
                      color: client.status === 'Archived' ? 'var(--text-muted)' : '#22c55e'
                    }}>
                      {client.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 2rem' }}>
                     <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => handleEdit(client)} className="glass btn-hover" style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', color: '#fff' }}>
                           <Edit2 size={16} />
                        </button>
                        <Link href={`/clients/${client.id}`} className="glass btn-hover" style={{ padding: '0.5rem', borderRadius: '8px' }}>
                           <ExternalLink size={16} />
                        </Link>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <PremiumEmptyState 
          icon={<Users />}
          title="No Client Partners Found"
          description={clients.length === 0 ? "Start by creating your first client profile to manage leads and reports." : "No clients match your current search query."}
          actionLabel="Add Client"
          onAction={handleCreate} 
        />
      )}

      <ClientModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        client={selectedClient}
      />
    </div>
  );
}
