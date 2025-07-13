import React from 'react';

type SelectProps = {
  value: string;
  onValueChange: (value: string) => void;
  name?: string;
  required?: boolean;
  children: React.ReactNode;
};

export function Select({ value, onValueChange, name, required, children }: SelectProps) {
  return (
    <select value={value} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onValueChange(e.target.value)} name={name} required={required} style={{ padding: '8px', borderRadius: 4, border: '1px solid #ccc' }}>
      {children}
    </select>
  );
}
export function SelectTrigger({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
export function SelectValue({ placeholder }: { placeholder: string }) {
  return <option value="" disabled>{placeholder}</option>;
}
export function SelectContent({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
export function SelectItem({ value, children }: { value: string; children: React.ReactNode }) {
  return <option value={value}>{children}</option>;
}
