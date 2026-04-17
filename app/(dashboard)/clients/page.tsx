import { getClients } from "@/app/actions/clients";
import { 
  Users, 
  Plus, 
  MoreHorizontal, 
  Search, 
  Filter,
  Mail,
  Phone,
  Building2,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-muted)' }}>CRM</h2>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-outfit)' }}>Client Partners</h1>
        </div>
        <button className="glass" style={{ 
          background: 'var(--primary)', 
          color: '#000', 
          border: 'none', 
          padding: '0.75rem 1.5rem', 
          borderRadius: '12px', 
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          cursor: 'pointer'
        }}>
          <Plus size={18} />
          Add Client
        </button>
      </header>

      {/* Filters & Search */}
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <div className="glass" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.625rem 1rem',
          borderRadius: '12px',
          flex: 1,
          maxWidth: '400px'
        }}>
          <Search size={18} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search by name, company, or email..." 
            style={{ background: 'none', border: 'none', width: '100%', color: '#fff', outline: 'none' }}
          />
        </div>
        <button className="glass" style={{ padding: '0.625rem 1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
          <Filter size={18} />
          Filter
        </button>
      </div>

      {/* Clients Table */}
      <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1.25rem 2rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-muted)' }}>CLIENT</th>
              <th style={{ padding: '1.25rem 2rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-muted)' }}>COMPANY</th>
              <th style={{ padding: '1.25rem 2rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-muted)' }}>STATUS</th>
              <th style={{ padding: '1.25rem 2rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-muted)' }}>REVENUE</th>
              <th style={{ padding: '1.25rem 2rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-muted)' }}></th>
            </tr>
          </thead>
          <tbody>
            {clients.length > 0 ? clients.map((client) => (
              <tr key={client.id} className="table-row" style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s ease' }}>
                <td style={{ padding: '1.25rem 2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ 
                      width: '40px', height: '40px', borderRadius: '12px', background: 'var(--surface)', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--primary)'
                    }}>
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{client.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{client.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1.25rem 2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Building2 size={16} color="var(--text-muted)" />
                    {client.company}
                  </div>
                </td>
                <td style={{ padding: '1.25rem 2rem' }}>
                  <span style={{ 
                    padding: '4px 12px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 600,
                    background: client.status === 'Active' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255,255,255,0.05)',
                    color: client.status === 'Active' ? '#22c55e' : 'var(--text-muted)'
                  }}>
                    {client.status}
                  </span>
                </td>
                <td style={{ padding: '1.25rem 2rem', fontWeight: 700, fontFamily: 'var(--font-outfit)' }}>
                  ${client.revenue.toLocaleString()}
                </td>
                <td style={{ padding: '1.25rem 2rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                    <Link href={`/clients/${client.id}`} className="glass" style={{ padding: '0.5rem', borderRadius: '8px' }}>
                      <ExternalLink size={16} color="var(--text-muted)" />
                    </Link>
                    <button className="glass" style={{ padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}>
                      <MoreHorizontal size={16} color="var(--text-muted)" />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div className="glass" style={{ padding: '1rem', borderRadius: '20px' }}>
                      <Users size={32} color="var(--primary)" />
                    </div>
                    <div>
                      <h3 style={{ fontWeight: 600 }}>No clients found</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Start by adding your first client partner.</p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
