import { getLeads } from "@/app/actions/leads";
import { 
  Target, 
  Plus, 
  Search, 
  Filter,
  Mail,
  Phone,
  Building2,
  Calendar,
  Zap,
  MoreVertical
} from "lucide-react";

export default async function LeadsPage() {
  const leads = await getLeads();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Hot': return '#ef4444';
      case 'Warm': return '#facc15';
      case 'Cold': return '#3b82f6';
      case 'Converted': return '#22c55e';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-muted)' }}>CRM</h2>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-outfit)' }}>Pipeline & Leads</h1>
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
          New Lead
        </button>
      </header>

      {/* Summary Stats */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div className="glass" style={{ flex: 1, padding: '1.5rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={20} color="#ef4444" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>HOT LEADS</div>
            <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>{leads.filter(l => l.status === 'Hot').length}</div>
          </div>
        </div>
        <div className="glass" style={{ flex: 1, padding: '1.5rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(250, 204, 21, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Target size={20} color="#facc15" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL PIPELINE</div>
            <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>{leads.length}</div>
          </div>
        </div>
        <div className="glass" style={{ flex: 1, padding: '1.5rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <Calendar size={20} color="#3b82f6" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CONVERTED (MO)</div>
            <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>{leads.filter(l => l.status === 'Converted').length}</div>
          </div>
        </div>
      </div>

      {/* Tools */}
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
            placeholder="Search leads..." 
            style={{ background: 'none', border: 'none', width: '100%', color: '#fff', outline: 'none' }}
          />
        </div>
        <button className="glass" style={{ padding: '0.625rem 1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
          <Filter size={18} />
          Source
        </button>
      </div>

      {/* Leads Table */}
      <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1.25rem 2rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-muted)' }}>LEAD NAME</th>
              <th style={{ padding: '1.25rem 2rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-muted)' }}>SOURCE</th>
              <th style={{ padding: '1.25rem 2rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-muted)' }}>ID SCORE</th>
              <th style={{ padding: '1.25rem 2rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-muted)' }}>COMPANY</th>
              <th style={{ padding: '1.25rem 2rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-muted)' }}></th>
            </tr>
          </thead>
          <tbody>
            {leads.length > 0 ? leads.map((lead) => (
              <tr key={lead.id} className="table-row" style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.2s ease' }}>
                <td style={{ padding: '1.25rem 2rem' }}>
                  <div style={{ fontWeight: 600 }}>{lead.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{lead.email}</div>
                </td>
                <td style={{ padding: '1.25rem 2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)' }} />
                    {lead.source}
                  </div>
                </td>
                <td style={{ padding: '1.25rem 2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ 
                      width: '12px', height: '12px', borderRadius: '3px', 
                      background: getStatusColor(lead.status) 
                    }} />
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{lead.status}</span>
                  </div>
                </td>
                <td style={{ padding: '1.25rem 2rem' }}>
                  <div style={{ fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Building2 size={16} color="var(--text-muted)" />
                    {lead.company || '--'}
                  </div>
                </td>
                <td style={{ padding: '1.25rem 2rem' }}>
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                     <button className="glass" style={{ padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}>
                      <MoreVertical size={16} color="var(--text-muted)" />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div className="glass" style={{ padding: '1rem', borderRadius: '20px' }}>
                      <Target size={32} color="var(--primary)" />
                    </div>
                    <div>
                      <h3 style={{ fontWeight: 600 }}>Pipeline is empty</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Generate some leads to start your growth.</p>
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
