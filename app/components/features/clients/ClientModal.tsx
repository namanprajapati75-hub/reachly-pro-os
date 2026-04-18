"use client";

import { useState, useEffect } from "react";
import Modal from "@/app/components/ui/Modal";
import { useToast } from "@/app/components/ui/ToastProvider";
import { createClient, updateClient, deleteClient } from "@/app/actions/clients";
import { Loader2, Trash2 } from "lucide-react";

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: any; // null for create mode
}

export default function ClientModal({ isOpen, onClose, client }: ClientModalProps) {
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    status: "Active",
    revenue: 0,
  });

  useEffect(() => {
    if (client) {
      setFormData({
        name: client.name || "",
        company: client.company || "",
        email: client.email || "",
        phone: client.phone || "",
        status: client.status || "Active",
        revenue: client.revenue || 0,
      });
      setIsConfirmingDelete(false);
      setDeleteConfirmText("");
    } else {
      setFormData({ name: "", company: "", email: "", phone: "", status: "Active", revenue: 0 });
    }
  }, [client, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (client?.id) {
        const res = await updateClient(client.id, formData);
        if (res.success) {
          addToast("Client updated successfully!", "success");
          onClose();
        } else {
          addToast("Failed to update client.", "error");
        }
      } else {
        const res = await createClient(formData);
        if (res.success) {
          addToast("Client created successfully!", "success");
          onClose();
        } else {
          addToast("Failed to create client.", "error");
        }
      }
    } catch (err) {
      addToast("An unexpected error occurred.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleArchive = async () => {
    if (!client?.id) return;
    setIsSubmitting(true);
    try {
       const res = await updateClient(client.id, { status: "Archived" });
       if (res.success) {
         addToast("Client archived successfully. Data preserved.", "success");
         onClose();
       } else {
         addToast("Failed to archive client", "error");
       }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleHardDelete = async () => {
    if (!client?.id || deleteConfirmText !== "DELETE") return;
    setIsSubmitting(true);
    try {
      const res = await deleteClient(client.id);
      if (res.success) {
        addToast("Client permanently deleted.", "success");
        onClose();
      } else {
        addToast("Failed to delete client.", "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={client ? "Edit Client" : "New Client"}>
      {isConfirmingDelete ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <h3 style={{ color: '#ef4444', fontWeight: 800, marginBottom: '0.5rem' }}>DANGER: Hard Delete</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              This will permanently delete this client. Related leads and tasks will lose their client association unless manually deleted.
              We recommend <strong>Archiving</strong> instead.
            </p>
          </div>
          
          <label style={{ fontSize: '0.875rem', fontWeight: 700 }}>
            Type DELETE to confirm:
            <input 
              type="text" 
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="DELETE"
              style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--border)', borderRadius: '8px', color: '#fff' }}
            />
          </label>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button 
              onClick={() => setIsConfirmingDelete(false)} 
              className="glass btn-hover" 
              style={{ flex: 1, padding: '0.75rem', borderRadius: '8px' }}
            >
              Cancel
            </button>
            <button 
              onClick={handleHardDelete} 
              disabled={deleteConfirmText !== "DELETE" || isSubmitting}
              style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', background: '#ef4444', color: '#fff', border: 'none', fontWeight: 700, opacity: deleteConfirmText !== "DELETE" ? 0.5 : 1 }}
            >
              {isSubmitting ? <Loader2 className="spinner" size={16} /> : "Hard Delete"}
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
              Client Name
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff' }} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
              Company Name
              <input required type="text" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff' }} />
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
              Email Address
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff' }} />
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
              Phone Number
              <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff' }} />
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
              Status
              <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff' }}>
                <option value="Active" style={{ background: '#000' }}>Active</option>
                <option value="Paused" style={{ background: '#000' }}>Paused</option>
                <option value="Archived" style={{ background: '#000' }}>Archived</option>
                <option value="Terminated" style={{ background: '#000' }}>Terminated</option>
              </select>
            </label>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 600 }}>
              Starting Revenue ($)
              <input type="number" step="0.01" value={formData.revenue} onChange={e => setFormData({...formData, revenue: parseFloat(e.target.value) || 0})} style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff' }} />
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <div>
              {client && (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {client.status !== 'Archived' && (
                    <button type="button" onClick={handleArchive} className="glass btn-hover" style={{ padding: '0.75rem 1rem', borderRadius: '8px', color: 'var(--text-muted)' }}>
                      Archive
                    </button>
                  )}
                  <button type="button" onClick={() => setIsConfirmingDelete(true)} className="glass btn-hover" style={{ padding: '0.75rem 1rem', borderRadius: '8px', color: '#ef4444' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button type="button" onClick={onClose} className="glass btn-hover" style={{ padding: '0.75rem 1.5rem', borderRadius: '8px' }}>Cancel</button>
              <button type="submit" disabled={isSubmitting} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', background: 'var(--primary)', color: '#000', border: 'none', fontWeight: 800 }}>
                {isSubmitting ? <Loader2 className="spinner" size={18} /> : "Save Client"}
              </button>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
}
