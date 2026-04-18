"use client";

import { useState } from "react";
import Modal from "@/app/components/ui/Modal";
import { useToast } from "@/app/components/ui/ToastProvider";
import { generateClientReport } from "@/app/actions/reports";
import { Loader2 } from "lucide-react";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  clients: any[];
}

export default function ReportModal({ isOpen, onClose, clients }: ReportModalProps) {
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [clientId, setClientId] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) return;
    
    setIsSubmitting(true);
    try {
      const res = await generateClientReport(clientId);
      if (res.success) {
        addToast("Performance report generated successfully!", "success");
        onClose();
      } else {
        addToast("Failed to generate report.", "error");
      }
    } catch (err) {
      addToast("An unexpected error occurred.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Generate Client Report">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Select a client to aggregate their leads, activities, and tasks into a monthly performance report.
        </p>

        <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
          Client
          <select 
            required 
            value={clientId} 
            onChange={(e) => setClientId(e.target.value)} 
            style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff' }}
          >
            <option value="" disabled style={{ background: '#000' }}>-- Select a Client --</option>
            {clients.map(c => (
              <option key={c.id} value={c.id} style={{ background: '#000' }}>{c.company || c.name}</option>
            ))}
          </select>
        </label>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          <button type="button" onClick={onClose} className="glass btn-hover" style={{ padding: '0.75rem 1.5rem', borderRadius: '8px' }}>
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting || !clientId} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', background: 'var(--primary)', color: '#000', border: 'none', fontWeight: 800 }}>
            {isSubmitting ? <Loader2 className="spinner" size={18} /> : "Generate Report"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
