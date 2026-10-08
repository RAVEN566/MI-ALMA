// src/components/common/Select.tsx
import React from 'react';

type Option = { value: string; label: string };

interface SelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
}

export const Select: React.FC<SelectProps> = ({ label, value, onChange, options }) => (
  <div className="space-y-1">
    {label && <label className="text-sm font-medium text-slate-200">{label}</label>}
    <select
      className="w-full rounded border border-twilight-500/30 bg-midnight-900/70 py-2 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-twilight-400"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);
