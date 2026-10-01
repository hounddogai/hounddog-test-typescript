import type { ComponentProps, ReactNode } from "react";

const buttonStyles = {
  primary: "bg-emerald-700 text-white hover:bg-emerald-800 focus-visible:outline-emerald-700",
  secondary: "bg-white text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50 focus-visible:outline-slate-500",
  danger: "bg-rose-600 text-white hover:bg-rose-700 focus-visible:outline-rose-600",
};

export type ButtonVariant = keyof typeof buttonStyles;

export const buttonClass = (variant: ButtonVariant = "primary") =>
  `inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold shadow-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50 ${buttonStyles[variant]}`;

export function Button({ variant, className = "", ...props }: ComponentProps<"button"> & { variant?: ButtonVariant }) {
  return <button className={`${buttonClass(variant)} ${className}`} {...props} />;
}

export function Panel({ title, actions, children }: { title?: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      {title || actions ? (
        <div className="mb-4 flex items-center justify-between gap-4">
          {title ? <h2 className="text-base font-semibold text-slate-900">{title}</h2> : null}
          {actions}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export const inputClass =
  "block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-xs placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 focus:outline-none";

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: callers pass the input as children, which the rule cannot see
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      {children}
      {hint ? <span className="text-xs text-slate-500">{hint}</span> : null}
    </label>
  );
}

export function Fact({ label, value }: { label: string; value?: ReactNode }) {
  return (
    <div>
      <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">{label}</dt>
      <dd className="mt-1 text-sm text-slate-900">{value || <span className="text-slate-400">Not recorded</span>}</dd>
    </div>
  );
}
