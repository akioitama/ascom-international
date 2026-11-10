"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
    <form className="grid gap-4" onSubmit={form.handleSubmit(onSubmit)} noValidate>
      <Field label="Full name" error={form.formState.errors.full_name?.message}>
        <input className="field" {...form.register("full_name")} />
      </Field>
      <Field label="Company" error={form.formState.errors.company?.message}>
        <input className="field" {...form.register("company")} />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" error={form.formState.errors.email?.message}>
          <input className="field" type="email" {...form.register("email")} />
        </Field>
        <Field label="Phone" error={form.formState.errors.phone?.message}>
          <input className="field" {...form.register("phone")} />
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Country" error={form.formState.errors.country?.message}>
          <input className="field" {...form.register("country")} />
        </Field>
        <Field label="Inquiry category" error={form.formState.errors.category?.message}>
          <select className="field" {...form.register("category")}>
            {CATEGORIES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Subject" error={form.formState.errors.subject?.message}>
        <input className="field" {...form.register("subject")} />
      </Field>
      <Field label="Message" error={form.formState.errors.message?.message}>
        <textarea className="field min-h-36" {...form.register("message")} />
      </Field>
      <p className="text-sm text-muted">This opens your email program. Nothing is saved on the website.</p>
      <button className="bg-blue px-5 py-3 text-sm font-semibold text-white" type="submit">
        Email the team
      </button>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1 text-sm">
      <span className="font-medium">{label}</span>
      {children}
      {error ? <span className="text-red-700">{error}</span> : null}
    </label>
  );
}
