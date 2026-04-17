"use client";

import React from 'react';

export function GhostCard() {
  return (
    <div className="glass skeleton" style={{
      width: '100%',
      height: '180px',
      borderRadius: '24px',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <div className="skeleton" style={{ width: '40%', height: '20px', background: 'rgba(255,255,255,0.08)' }}></div>
      <div className="skeleton" style={{ width: '80%', height: '40px', background: 'rgba(255,255,255,0.08)', marginTop: 'auto' }}></div>
      <div className="skeleton" style={{ width: '30%', height: '16px', background: 'rgba(255,255,255,0.08)' }}></div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '2rem',
      padding: '1.25rem 2rem',
      borderBottom: '1px solid var(--border)'
    }}>
      <div className="skeleton" style={{ width: '30px', height: '30px', borderRadius: '8px' }}></div>
      <div className="skeleton" style={{ width: '200px', height: '16px' }}></div>
      <div className="skeleton" style={{ width: '100px', height: '16px' }}></div>
      <div className="skeleton" style={{ width: '120px', height: '16px' }}></div>
      <div style={{ flex: 1 }}></div>
      <div className="skeleton" style={{ width: '40px', height: '16px' }}></div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="glass skeleton" style={{
      width: '100%',
      height: '350px',
      borderRadius: '24px',
      padding: '2.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem'
    }}>
      <div className="skeleton" style={{ width: '150px', height: '24px' }}></div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
         {[...Array(12)].map((_, i) => (
           <div key={i} className="skeleton" style={{ flex: 1, height: `${Math.random() * 60 + 20}%`, borderRadius: '4px' }}></div>
         ))}
      </div>
    </div>
  );
}
