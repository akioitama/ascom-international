"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const CATEGORIES = [
  "General",
  "Construction",
  "Manufacturing",
  "Creative Solutions",
  "Technology Solutions",
  "Engineering",
  "Road Safety",
  "Vehicle Customisation",
  "Products",
  "Careers",
  "Code of conduct",
  "Other",
];

const schema = z.object({
  full_name: z.string().min(2, "Enter your name"),
  company: z.string().optional(),
  email: z.email("Enter a valid email"),
  phone: z.string().min(6, "Enter a phone number"),
  country: z.string().min(2, "Enter a country"),
  category: z.string().min(2),
  subject: z.string().min(2, "Enter a subject"),
  message: z.string().min(10, "Write a short message"),
});

type Values = z.infer<typeof schema>;

export function ContactForm({ category = "General", subject = "", email = "info@ascomintl.com" }: { category?: string; subject?: string; email?: string }) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { full_name: "", company: "", email: "", phone: "", country: "Pakistan", category, subject, message: "" },
  });
  const errors = form.formState.errors;

  function onSubmit(values: Values) {
    const body = [
      `Name: ${values.full_name}`,
      `Company: ${values.company || "-"}`,
      `Email: ${values.email}`,
      `Phone: ${values.phone}`,
      `Country: ${values.country}`,
      `Category: ${values.category}`,
      "",
      values.message,
    ].join("\n");
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(values.subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form className="grid gap-x-8 gap-y-7" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
        <Field label="Full name" required error={errors.full_name?.message}>
          <input className="field" autoComplete="name" {...form.register("full_name")} />
        </Field>
        <Field label="Company" error={errors.company?.message}>
          <input className="field" autoComplete="organization" {...form.register("company")} />
        </Field>
      </div>
      <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
        <Field label="Email" required error={errors.email?.message}>
          <input className="field" type="email" autoComplete="email" {...form.register("email")} />
        </Field>
        <Field label="Phone" required error={errors.phone?.message}>
          <input className="field" type="tel" autoComplete="tel" {...form.register("phone")} />
        </Field>
      </div>
      <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
        <Field label="Country" required error={errors.country?.message}>
          <input className="field" autoComplete="country-name" {...form.register("country")} />
        </Field>
        <Field label="Inquiry category" required error={errors.category?.message}>
          <select className="field" {...form.register("category")}>
            {CATEGORIES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Subject" required error={errors.subject?.message}>
        <input className="field" {...form.register("subject")} />
      </Field>
      <Field label="Message" required error={errors.message?.message}>
        <textarea className="field min-h-40 resize-y" {...form.register("message")} />
      </Field>
      <div className="flex flex-col-reverse gap-5 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-sm leading-6 text-muted">This opens your email program. Nothing is saved on the website.</p>
        <button className="group/button inline-flex h-14 items-center justify-center gap-3 bg-navy px-7 text-sm font-medium text-white transition-colors duration-300 hover:bg-blue" type="submit">
          Email the team
          <ArrowRight className="h-4 w-4 transition-transform duration-500 ease-out-expo group-hover/button:translate-x-1" strokeWidth={1.75} aria-hidden />
        </button>
      </div>
    </form>
  );
}

function Field({ label, error, required = false, children }: { label: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="grid content-start gap-1">
      <span className="eyebrow text-muted">
        {label}
        {required ? <span className="text-blue"> *</span> : null}
      </span>
      {children}
      {error ? <span className="pt-1 text-sm text-red-700">{error}</span> : null}
    </label>
  );
}
