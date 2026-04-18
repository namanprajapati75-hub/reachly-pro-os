"use client";

import React, { useState } from 'react';
import { Target, Plus, Filter, Zap, Edit2, Search } from "lucide-react";
import Link from "next/link";
import PremiumEmptyState from "@/app/components/ui/PremiumEmptyState";
import LeadModal from "@/app/components/features/leads/LeadModal";

interface LeadsClientProps {
  leads: any[];
  clients: any[];
}

export default function LeadsClient({ leads, clients }: LeadsClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (l.company || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = () => {
    setSelectedLead(null);
    setIsModalOpen(true);
  };

  const handleEdit = (lead: any) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-md)' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-muted)' }}>CRM</h2>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-outfit)' }}>Leads Pipeline</h1>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 1rem', borderRadius: '12px' }}>
            <Search size={16} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search leads..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: 'none', border: 'none', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
            />
          </div>
          <button className="glass btn-hover" style={{ 
            padding: '0.75rem 1.75rem', borderRadius: '12px', fontWeight: 800,
            display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'
          }}>
            <Filter size={18} />
            Filters
          </button>
          <button onClick={handleCreate} className="glass btn-hover" style={{ 
            background: 'var(--primary)', color: '#000', border: 'none', 
            padding: '0.75rem 1.75rem', borderRadius: '12px', fontWeight: 800,
            display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'
          }}>
            <Plus size={18} />
            Capture Lead
          </button>
        </div>
      </header>

      {filteredLeads.length > 0 ? (
        <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '1.25rem 2rem', fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Prospect Name</th>
                <th style={{ padding: '1.25rem 2rem', fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Source</th>
                <th style={{ padding: '1.25rem 2rem', fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Confidence</th>
                <th style={{ padding: '1.25rem 2rem', fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '1.25rem 2rem', fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}></th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="table-row card-hover" style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1.25rem 2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 700 }}>{lead.name}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lead.email}</span>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 2rem' }}>
                    <div className="glass" style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600 }}>
                      {lead.source}
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 2rem' }}>
                    <div style={{ display: 'flex', gap: '3px' }}>
                       {[...Array(5)].map((_, i) => (
                         <div key={i} style={{ width: '4px', height: '14px', background: i < (lead.aiScore / 20) ? 'var(--primary)' : 'rgba(255,255,255,0.05)', borderRadius: '1.5px' }}></div>
                       ))}
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 2rem' }}>
                    <span style={{ 
                      padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800,
                      background: lead.status === 'Hot' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.05)', 
                      color: lead.status === 'Hot' ? '#ef4444' : 'var(--text-muted)'
                    }}>
                      {lead.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 2rem' }}>
                     <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => handleEdit(lead)} className="glass btn-hover" style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', color: '#fff' }}>
                           <Edit2 size={16} />
                        </button>
                        <Link href="/ai-hub" className="glass btn-hover" style={{ padding: '0.5rem', borderRadius: '8px' }}>
                           <Zap size={16} />
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
          icon={<Target />}
          title="No Leads Detected"
          description={leads.length === 0 ? "Your pipeline is currently empty. Capture a prospect to begin the AI qualification flow." : "No leads match your current search query."}
          actionLabel="Capture Lead"
          onAction={handleCreate}
        />
      )}

      <LeadModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lead={selectedLead}
        clients={clients}
      />
    </div>
  );
}
