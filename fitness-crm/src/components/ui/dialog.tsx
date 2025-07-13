import React, { useState } from 'react';

export function Dialog({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
export function DialogTrigger({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return <button onClick={onClick}>{children}</button>;
}
export function DialogContent({ children }: { children: React.ReactNode }) {
  return <div style={{ background: '#fff', border: '1px solid #ccc', padding: 16 }}>{children}</div>;
}
export function DialogHeader({ children }: { children: React.ReactNode }) {
  return <div style={{ fontWeight: 'bold', marginBottom: 8 }}>{children}</div>;
}
export function DialogTitle({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 18 }}>{children}</div>;
}
export function DialogClose({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return <button onClick={onClick}>{children}</button>;
} 