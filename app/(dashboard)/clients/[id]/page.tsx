import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { 
  Building2, 
  Mail, 
  Phone, 
  Target, 
  Calendar,
  ChevronLeft,
  Briefcase,
  TrendingUp,
  FileText
} from "lucide-react";
import Link from "next/link";

async function getClient(id: string) {
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      leads: true,
      tasks: {
        orderBy: [{ dueDate: 'asc' }]
      },
      reports: {
        orderBy: [{ createdAt: 'desc' }]
      }
    }
  });
  return client;
}

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await getClient(id);

  if (!client) {
    notFound();
  }

  const activeLeads = client.leads.filter(l => l.status !== 'Converted' && l.status !== 'Lost');
  const pendingTasks = client.tasks.filter(t => t.status !== 'Completed');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <Link href="/clients" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
          <ChevronLeft size={16} />
          Back to Portfolio
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, fontFamily: 'var(--font-outfit)' }}>{client.name}</h1>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Building2 size={16} />
                {client.company}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} />
                {client.email}
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)' }}>${client.revenue.toLocaleString()}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)' }}>ANNUAL VALUE</div>
          </div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Quick Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            <div className="glass card-hover" style={{ padding: '1.5rem', borderRadius: '20px' }}>
              <Target size={20} color="var(--primary)" style={{ marginBottom: '1rem' }} />
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{activeLeads.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>ACTIVE LEADS</div>
            </div>
            <div className="glass card-hover" style={{ padding: '1.5rem', borderRadius: '20px' }}>
              <Briefcase size={20} color="var(--primary)" style={{ marginBottom: '1rem' }} />
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{pendingTasks.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>PENDING TASKS</div>
            </div>
            <div className="glass card-hover" style={{ padding: '1.5rem', borderRadius: '20px' }}>
              <TrendingUp size={20} color="var(--primary)" style={{ marginBottom: '1rem' }} />
              <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{client.reports.length}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>REPORTS SENT</div>
            </div>
          </div>

          {/* Pending Tasks Section */}
          <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
             <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '1.5rem' }}>Critical Deliverables</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {pendingTasks.length > 0 ? pendingTasks.map(task => (
                  <div key={task.id} className="glass" style={{ padding: '1.25rem', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                     <div>
                        <div style={{ fontWeight: 700 }}>{task.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                           <Calendar size={12} />
                           Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                        </div>
                     </div>
                     <div style={{ 
                        padding: '4px 10px', borderRadius: '8px', fontSize: '0.625rem', fontWeight: 800,
                        background: task.priority === 'Urgent' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.05)',
                        color: task.priority === 'Urgent' ? '#ef4444' : 'var(--text-muted)'
                     }}>
                        {task.priority.toUpperCase()}
                     </div>
                  </div>
                )) : (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>No pending tasks for this client.</p>
                )}
             </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
           {/* Recent Reports */}
           <div className="glass" style={{ padding: '2rem', borderRadius: '24px' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '1.5rem' }}>Reporting History</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 {client.reports.slice(0, 5).map(report => (
                   <div key={report.id} className="glass btn-hover" style={{ padding: '1rem', borderRadius: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <FileText size={18} color="var(--primary)" />
                      <div style={{ flex: 1 }}>
                         <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{report.title}</div>
                         <div style={{ fontSize: '0.625rem', color: 'var(--text-muted)' }}>{new Date(report.createdAt).toLocaleDateString()}</div>
                      </div>
                   </div>
                 ))}
                 <button className="glass btn-hover" style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', marginTop: '0.5rem' }}>
                    GENERATE NEW REPORT
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
