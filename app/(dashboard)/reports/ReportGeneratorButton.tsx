"use client";

import { useState } from "react";
import { Plus, BarChart3, ChevronDown, Check } from "lucide-react";
import { generateClientReport } from "@/app/actions/reports";
import { useRouter } from "next/navigation";

interface ReportGeneratorButtonProps {
  clients: any[];
}

export default function ReportGeneratorButton({ clients }: ReportGeneratorButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();

  const handleGenerate = async (clientId: string) => {
    setIsGenerating(true);
    setIsOpen(false);
    const result = await generateClientReport(clientId);
    if (result.success && result.report) {
      router.push(`/reports/${result.report.id}`);
    }
    setIsGenerating(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        disabled={isGenerating}
        className="glass" 
        style={{ 
          background: 'var(--primary)', color: '#000', border: 'none', 
          padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
          opacity: isGenerating ? 0.7 : 1
        }}
      >
        <Plus size={18} />
        {isGenerating ? 'ANALYZING DATA...' : 'Generate Report'}
        <ChevronDown size={14} style={{ marginLeft: '4px' }} />
      </button>

      {isOpen && (
        <div className="glass" style={{ 
          position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', 
          width: '280px', borderRadius: '16px', padding: '0.5rem', zIndex: 100,
          maxHeight: '300px', overflowY: 'auto'
        }}>
          <div style={{ padding: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700 }}>SELECT CLIENT PARTNER</div>
          {clients.map((client) => (
            <button
              key={client.id}
              onClick={() => handleGenerate(client.id)}
              className="menu-item"
              style={{
                width: '100%', padding: '0.75rem', borderRadius: '8px', border: 'none',
                background: 'transparent', color: '#fff', textAlign: 'left', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.75rem'
              }}
            >
              <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', fontSize: '0.625rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {client.name.charAt(0)}
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{client.name}</span>
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        .menu-item:hover {
          background: rgba(255, 255, 255, 0.05) !important;
        }
      `}</style>
    </div>
  );
}
