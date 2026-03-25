import type { ReactNode } from "react";

type InputFieldProps = {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: ReactNode;
};

export const InputField = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  icon,
}: InputFieldProps) => (
  <label className="block space-y-2">
    <span className="text-sm font-semibold text-slate-200">{label}</span>
    <span className="flex items-center gap-3 rounded-2xl border border-slate-600 bg-slate-800/85 px-4 py-3 transition focus-within:border-sky-500 focus-within:ring-4 focus-within:ring-sky-500/20">
      <span className="text-slate-500">{icon}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
      />
    </span>
  </label>
);
