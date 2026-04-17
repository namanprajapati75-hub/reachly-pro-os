import { getClientById } from "@/app/actions/clients";
import { 
  Building2, 
  Mail, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  Clock,
  ArrowLeft,
  MoreVertical,
  Target
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ClientProfilePage({ params }: { params: { id: string } }) {
  const client = await getClientById(params.id);

  if (!client) {
    notFound();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/clients" className="glass" style={{ padding: '0.5rem', borderRadius: '10px' }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>CLIENT PROFILE</h2>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-outfit)' }}>{client.name}</h1>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="glass" style={{ padding: '0.75rem 1.25rem', borderRadius: '12px', fontWeight: 600 }}>Edit Details</button>
          <button className="glass" style={{ background: 'var(--primary)', color: '#000', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '12px', fontWeight: 700 }}>Generate Report</button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' }}>
        {/* Left Col: Details */}
        <div style={{ gridColumn: 'span 4', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
            <h3 style={{ fontWeight: 600, marginBottom: '1.5rem' }}>Contact Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Building2 size={20} color="var(--primary)" />
                <span style={{ fontSize: '0.925rem' }}>{client.company}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Mail size={20} color="var(--primary)" />
                <span style={{ fontSize: '0.925rem' }}>{client.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Phone size={20} color="var(--primary)" />
                <span style={{ fontSize: '0.925rem' }}>{client.phone || 'No phone added'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Calendar size={20} color="var(--primary)" />
                <span style={{ fontSize: '0.925rem' }}>Partner since {new Date(client.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
            <h3 style={{ fontWeight: 600, marginBottom: '1.5rem' }}>Lead Performance</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{client.leads.length}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL LEADS</div>
              </div>
              <div style={{ flex: 1, textAlign: 'center', borderLeft: '1px solid var(--border)' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#22c55e' }}>{client.leads.filter(l => l.status === 'Converted').length}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CONVERTED</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Activity & Tasks */}
        <div style={{ gridColumn: 'span 8', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
           <div className="glass" style={{ padding: '2rem', borderRadius: '24px', flex: 1 }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
               <h3 style={{ fontWeight: 600 }}>Active Tasks</h3>
               <button style={{ color: 'var(--primary)', background: 'none', border: 'none', fontWeight: 600, fontSize: '0.875rem' }}>View All</button>
             </div>
             
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               {client.tasks.length > 0 ? client.tasks.map(task => (
                 <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                   <div style={{ color: task.status === 'Done' ? '#22c55e' : 'var(--text-muted)' }}>
                     {task.status === 'Done' ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                   </div>
                   <div style={{ flex: 1 }}>
                     <div style={{ fontWeight: 600, fontSize: '0.925rem' }}>{task.title}</div>
                     <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Due {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</div>
                   </div>
                   <div style={{ 
                     fontSize: '0.75rem', fontWeight: 700, padding: '2px 8px', borderRadius: '4px',
                     background: task.priority === 'High' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.05)',
                     color: task.priority === 'High' ? '#ef4444' : 'var(--text-muted)'
                   }}>
                     {task.priority.toUpperCase()}
                   </div>
                 </div>
               )) : (
                 <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                   No active tasks for this client.
                 </div>
               )}
             </div>
           </div>

           <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
               <h3 style={{ fontWeight: 600 }}>Recent Activities</h3>
               <MoreVertical size={20} color="var(--text-muted)" />
             </div>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {client.activities.length > 0 ? client.activities.map((activity, i) => (
                  <div key={activity.id} style={{ display: 'flex', gap: '1rem', position: 'relative' }}>
                    {i !== client.activities.length - 1 && (
                      <div style={{ position: 'absolute', left: '10px', top: '24px', bottom: '-12px', width: '1px', background: 'var(--border)' }}></div>
                    )}
                    <div style={{ 
                      width: '20px', height: '20px', borderRadius: '50%', background: 'var(--surface)', 
                      border: '2px solid var(--primary)', zIndex: 1
                    }}></div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{activity.type}: {activity.content}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(activity.date).toLocaleString()}</div>
                    </div>
                  </div>
                )) : (
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No activity history found.</div>
                )}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
