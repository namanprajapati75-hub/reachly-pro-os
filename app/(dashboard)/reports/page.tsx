import { getReports } from "@/app/actions/reports";
import { getClients } from "@/app/actions/clients";
import { 
  BarChart3, 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Send,
  MoreHorizontal,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import ReportGeneratorButton from "./ReportGeneratorButton";

export default async function ReportsPage() {
  const [reports, clients] = await Promise.all([
    getReports(),
    getClients()
  ]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Approved': return { bg: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' };
      case 'Sent': return { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' };
      default: return { bg: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-muted)' }}>Deliverables</h2>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-outfit)' }}>Client Reporting</h1>
        </div>
        <ReportGeneratorButton clients={clients} />
      </header>

      {/* Stats Summary */}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div className="glass" style={{ flex: 1, padding: '1.5rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={20} color="var(--text-muted)" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PENDING APPROVAL</div>
            <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>{reports.filter(r => r.status === 'Draft').length}</div>
          </div>
        </div>
        <div className="glass" style={{ flex: 1, padding: '1.5rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(34, 197, 94, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={20} color="#22c55e" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>APPROVED RECENTLY</div>
            <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>{reports.filter(r => r.status === 'Approved').length}</div>
          </div>
        </div>
        <div className="glass" style={{ flex: 1, padding: '1.5rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             <Send size={20} color="#3b82f6" />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SENT THIS MONTH</div>
            <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>{reports.filter(r => r.status === 'Sent').length}</div>
          </div>
        </div>
      </div>

      {/* Table Hub */}
      <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '1.25rem 2rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-muted)' }}>REPORT TITLE</th>
              <th style={{ padding: '1.25rem 2rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-muted)' }}>CLIENT</th>
              <th style={{ padding: '1.25rem 2rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-muted)' }}>STATUS</th>
              <th style={{ padding: '1.25rem 2rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-muted)' }}>GENERATED</th>
              <th style={{ padding: '1.25rem 2rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-muted)' }}>CSAT</th>
              <th style={{ padding: '1.25rem 2rem', fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-muted)' }}></th>
            </tr>
          </thead>
          <tbody>
            {reports.length > 0 ? reports.map((report) => {
              const statusStyle = getStatusStyle(report.status);
              return (
                <tr key={report.id} className="table-row" style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '1.25rem 2rem' }}>
                    <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <FileText size={18} color="var(--primary)" />
                      {report.title}
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 2rem', fontSize: '0.875rem' }}>{report.client.name}</td>
                  <td style={{ padding: '1.25rem 2rem' }}>
                    <span style={{ 
                      padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 700,
                      background: statusStyle.bg, color: statusStyle.color
                    }}>
                      {report.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 2rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                    {new Date(report.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1.25rem 2rem' }}>
                     {report.csatScore ? (
                       <div style={{ display: 'flex', gap: '2px' }}>
                         {[...Array(5)].map((_, i) => (
                           <div key={i} style={{ width: '4px', height: '12px', background: i < report.csatScore ? 'var(--primary)' : 'rgba(255,255,255,0.1)', borderRadius: '1px' }}></div>
                         ))}
                       </div>
                     ) : (
                       <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pending</span>
                     )}
                  </td>
                  <td style={{ padding: '1.25rem 2rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <Link href={`/reports/${report.id}`} className="glass" style={{ padding: '0.5rem', borderRadius: '8px' }}>
                        <ChevronRight size={16} />
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={6} style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div className="glass" style={{ padding: '1rem', borderRadius: '20px' }}>
                      <BarChart3 size={32} color="var(--primary)" />
                    </div>
                    <div>
                      <h3 style={{ fontWeight: 600 }}>No reports generated</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Select a client and click "Generate Report" to begin.</p>
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
