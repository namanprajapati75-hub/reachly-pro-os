"use client";

import { useState, useEffect } from "react";
import Modal from "@/app/components/ui/Modal";
import { useToast } from "@/app/components/ui/ToastProvider";
import { createLead, updateLead, deleteLead } from "@/app/actions/leads";
import { Loader2, Trash2 } from "lucide-react";

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: any;
  clients?: any[]; // Pass clients for assignment
}

export default function LeadModal({ isOpen, onClose, lead, clients = [] }: LeadModalProps) {
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    source: "Website",
    status: "New",
    notes: "",
    assignedClientId: "",
  });

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || "",
        email: lead.email || "",
        phone: lead.phone || "",
        company: lead.company || "",
        source: lead.source || "Website",
        status: lead.status || "New",
        notes: lead.notes || "",
        assignedClientId: lead.assignedClientId || "",
      });
      setIsConfirmingDelete(false);
      setDeleteConfirmText("");
    } else {
      setFormData({ name: "", email: "", phone: "", company: "", source: "Website", status: "New", notes: "", assignedClientId: "" });
    }
  }, [lead, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const dataToSubmit = {
        ...formData,
        assignedClientId: formData.assignedClientId === "" ? null : formData.assignedClientId
      };

      if (lead?.id) {
        const res = await updateLead(lead.id, dataToSubmit);
        if (res.success) {
          addToast("Lead updated successfully!", "success");
          onClose();
        } else {
          addToast("Failed to update lead.", "error");
        }
      } else {
        const res = await createLead(dataToSubmit);
        if (res.success) {
          addToast("Lead created successfully!", "success");
          onClose();
        } else {
          addToast("Failed to create lead.", "error");
        }
      }
    } catch (err) {
      addToast("An unexpected error occurred.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHardDelete = async () => {
    if (!lead?.id || deleteConfirmText !== "DELETE") return;
    setIsSubmitting(true);
    try {
      const res = await deleteLead(lead.id);
      if (res.success) {
        addToast("Lead permanently deleted.", "success");
        onClose();
      } else {
        addToast("Failed to delete lead.", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={lead ? "Edit Lead" : "Capture Lead"} width="600px">
      {isConfirmingDelete ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <h3 style={{ color: '#ef4444', fontWeight: 800, marginBottom: '0.5rem' }}>DANGER: Hard Delete</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              This will permanently delete this lead and its associated AI history.
            </p>
          </div>
          <label style={{ fontSize: '0.875rem', fontWeight: 700 }}>
            Type DELETE to confirm:
            <input type="text" value={deleteConfirmText} onChange={e => setDeleteConfirmText(e.target.value)} placeholder="DELETE" style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border)', borderRadius: '8px', color: '#fff' }} />
          </label>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button onClick={() => setIsConfirmingDelete(false)} className="glass btn-hover" style={{ flex: 1, padding: '0.75rem', borderRadius: '8px' }}>Cancel</button>
            <button onClick={handleHardDelete} disabled={deleteConfirmText !== "DELETE" || isSubmitting} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', background: '#ef4444', color: '#fff', border: 'none', fontWeight: 700, opacity: deleteConfirmText !== "DELETE" ? 0.5 : 1 }}>
              {isSubmitting ? <Loader2 className="spinner" size={16} /> : "Hard Delete"}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
              Prospect Name
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff' }} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
              Email Address
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff' }} />
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
              Company (Optional)
              <input type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff' }} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
              Phone Number
              <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff' }} />
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
              Source
              <select value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff' }}>
                <option value="Website" style={{ background: '#000' }}>Website</option>
                <option value="Facebook" style={{ background: '#000' }}>Facebook Ads</option>
                <option value="Google" style={{ background: '#000' }}>Google Ads</option>
                <option value="Referral" style={{ background: '#000' }}>Referral</option>
              </select>
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
              Pipeline Stage
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff' }}>
                <option value="New" style={{ background: '#000' }}>New</option>
                <option value="Contacted" style={{ background: '#000' }}>Contacted</option>
                <option value="Interested" style={{ background: '#000' }}>Interested</option>
                <option value="Booked" style={{ background: '#000' }}>Meeting Booked</option>
                <option value="Won" style={{ background: '#22c55e' }}>Closed Won</option>
                <option value="Lost" style={{ background: '#ef4444' }}>Closed Lost</option>
              </select>
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
              Assign to Client
              <select value={formData.assignedClientId} onChange={e => setFormData({...formData, assignedClientId: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff' }}>
                <option value="" style={{ background: '#000' }}>None (Direct Lead)</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id} style={{ background: '#000' }}>{c.name}</option>
                ))}
              </select>
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <div>
              {lead && (
                <button type="button" onClick={() => setIsConfirmingDelete(true)} className="glass btn-hover" style={{ padding: '0.75rem 1rem', borderRadius: '8px', color: '#ef4444' }}>
                  <Trash2 size={18} />
                </button>
              )}
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="button" onClick={onClose} className="glass btn-hover" style={{ padding: '0.75rem 1.5rem', borderRadius: '8px' }}>Cancel</button>
              <button type="submit" disabled={isSubmitting} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', background: 'var(--primary)', color: '#000', border: 'none', fontWeight: 800 }}>
                {isSubmitting ? <Loader2 className="spinner" size={18} /> : "Save Lead"}
              </button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
}
