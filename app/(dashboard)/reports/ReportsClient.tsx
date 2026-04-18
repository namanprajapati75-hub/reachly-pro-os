"use client";

import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  Send,
  ChevronRight,
  BarChart3,
  Search,
  Plus,
  Trash2,
  Loader2
} from "lucide-react";
import Link from "next/link";
import PremiumEmptyState from "@/app/components/ui/PremiumEmptyState";
import ReportModal from "@/app/components/features/reports/ReportModal";
import { deleteReport } from "@/app/actions/reports";
import { useToast } from "@/app/components/ui/ToastProvider";

interface ReportsClientProps {
  reports: any[];
  clients: any[];
}

export default function ReportsClient({ reports, clients }: ReportsClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { addToast } = useToast();

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Approved': return { bg: 'rgba(34, 197, 94, 0.1)', color: '#22c55e' };
      case 'Sent': return { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' };
      default: return { bg: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' };
    }
  };

  const filteredReports = reports.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!confirm("Are you sure you want to delete this report?")) return;
    
    setDeletingId(id);
    try {
      const res = await deleteReport(id);
      if (res.success) {
         addToast("Report deleted successfully.", "success");
      } else {
         addToast("Failed to delete report.", "error");
      }
    } catch {
       addToast("Error deleting report.", "error");
    } finally {
       setDeletingId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-md)' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-muted)' }}>Deliverables</h2>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-outfit)' }}>Client Reporting</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 1rem', borderRadius: '12px' }}>
            <Search size={16} color="var(--text-muted)" />
            <input 
              type="text" 
              placeholder="Search reports..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: 'none', border: 'none', color: '#fff', fontSize: '0.875rem', outline: 'none' }}
            />
          </div>
          <button onClick={() => setIsModalOpen(true)} className="glass btn-hover" style={{ 
            background: 'var(--primary)', color: '#000', border: 'none', 
            padding: '0.75rem 1.75rem', borderRadius: '12px', fontWeight: 800,
            display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer'
          }}>
            <Plus size={18} />
            Generate Report
          </button>
        </div>
      </header>

      {reports.length > 0 ? (
        <>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
             <div className="glass card-hover" style={{ flex: 1, padding: '1.5rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Clock size={20} color="var(--text-muted)" />
                <div>
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>PENDING</div>
                   <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>{reports.filter(r => r.status === 'Draft').length}</div>
                </div>
             </div>
             <div className="glass card-hover" style={{ flex: 1, padding: '1.5rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <CheckCircle2 size={20} color="#22c55e" />
                <div>
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>APPROVED</div>
                   <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>{reports.filter(r => r.status === 'Approved').length}</div>
                </div>
             </div>
             <div className="glass card-hover" style={{ flex: 1, padding: '1.5rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Send size={20} color="#3b82f6" />
                <div>
                   <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>SENT</div>
                   <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>{reports.filter(r => r.status === 'Sent').length}</div>
                </div>
             </div>
          </div>

          <div className="glass" style={{ borderRadius: '24px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '1.25rem 2rem', fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Report Title</th>
                  <th style={{ padding: '1.25rem 2rem', fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Client</th>
                  <th style={{ padding: '1.25rem 2rem', fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</th>
                  <th style={{ padding: '1.25rem 2rem', fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Generated</th>
                  <th style={{ padding: '1.25rem 2rem', fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>CSAT</th>
                  <th style={{ padding: '1.25rem 2rem', fontWeight: 700, fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}></th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map((report) => {
                  const statusStyle = getStatusStyle(report.status);
                  const isDeleting = deletingId === report.id;
                  
                  return (
                    <tr key={report.id} className="table-row card-hover" style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '1.25rem 2rem' }}>
                        <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <FileText size={18} color="var(--primary)" />
                          {report.title}
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem 2rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-muted)' }}>{report.client.name}</td>
                      <td style={{ padding: '1.25rem 2rem' }}>
                        <span style={{ 
                          padding: '4px 10px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800,
                          background: statusStyle.bg, color: statusStyle.color
                        }}>
                          {report.status.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '1.25rem 2rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </td>
                      <td style={{ padding: '1.25rem 2rem' }}>
                         <div style={{ display: 'flex', gap: '3px' }}>
                           {[...Array(5)].map((_, i) => (
                             <div key={i} style={{ width: '4px', height: '14px', background: i < (report.csatScore || 0) ? 'var(--primary)' : 'rgba(255,255,255,0.05)', borderRadius: '1.5px' }}></div>
                           ))}
                         </div>
                      </td>
                      <td style={{ padding: '1.25rem 2rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                          <button 
                            onClick={(e) => handleDelete(report.id, e)} 
                            disabled={isDeleting}
                            className="glass btn-hover" 
                            style={{ padding: '0.5rem', borderRadius: '8px', color: '#ef4444', border: 'none', cursor: isDeleting ? 'not-allowed' : 'pointer', opacity: isDeleting ? 0.5 : 1 }}
                          >
                             {isDeleting ? <Loader2 size={16} className="spinner" /> : <Trash2 size={16} />}
                          </button>
                          <Link href={`/reports/${report.id}`} className="glass btn-hover" style={{ padding: '0.5rem', borderRadius: '8px' }}>
                            <ChevronRight size={16} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <PremiumEmptyState 
          icon={<BarChart3 />}
          title="No Reports Generated"
          description="Ready to show some results? Select a client partner from the generator and build your first high-impact performance report."
          actionLabel="Generate Now"
          onAction={() => setIsModalOpen(true)} 
        />
      )}

      <ReportModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        clients={clients}
      />
    </div>
  );
}
