import { getClients } from "@/app/actions/clients";
import { Users, Plus, Loader2, MoreHorizontal, Mail, Phone, ExternalLink } from "lucide-react";
import Link from "next/link";
import PremiumEmptyState from "@/app/components/ui/PremiumEmptyState";

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-md)' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-muted)' }}>Portfolio</h2>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-outfit)' }}>Client Partners</h1>
        </div>
        <button className="glass btn-hover" style={{ 
          background: 'var(--primary)', color: '#000', border: 'none', 
          padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 800,
          display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'
        }}>
          <Plus size={18} />
          Add Client
        </button>
      </header>

      {clients.length > 0 ? (
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
              {clients.map((client) => (
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
                      background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e'
                    }}>
                      {client.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 2rem' }}>
                     <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
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
          title="No Client Partners Yet"
          description="It looks like you haven't added any clients to your OS yet. Start by creating your first client profile to manage leads and reports."
          actionLabel="Add First Client"
          onAction={() => {}} // Placeholder for modal trigger
        />
      )}
    </div>
  );
}
