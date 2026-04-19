// src/components/PricingSection.tsx
"use client";

import { useState } from "react";

type Billing = "monthly" | "annual";
type Currency = "inr" | "usd";

interface Plan {
  name: string;
  minutes: string;
  maxLength: string;
  inrMonthly: string;
  inrAnnualMonthly: string | null;
  inrAnnualTotal: string | null;
  inrSaving: string | null;
  usdMonthly: string;
  usdAnnualMonthly: string | null;
  usdAnnualTotal: string | null;
  usdSaving: string | null;
  features: string[];
  highlighted?: boolean;
  cta: "Start Free" | "Get Started" | "Contact Us";
}

const PLANS: Plan[] = [
  {
    name: "FREE",
    minutes: "10",
    maxLength: "2 min",
    inrMonthly: "₹0",
    inrAnnualMonthly: null,
    inrAnnualTotal: null,
    inrSaving: null,
    usdMonthly: "$0",
    usdAnnualMonthly: null,
    usdAnnualTotal: null,
    usdSaving: null,
    features: [
      "10 minutes/month",
      "Up to 2-min videos",
      "720p · 9:16 Shorts/Reels",
      "Watermark on exports",
      "Basic visual library",
      "7-day video history",
    ],
    cta: "Start Free",
  },
  {
    name: "LITE",
    minutes: "120",
    maxLength: "3 min",
    inrMonthly: "₹1,999",
    inrAnnualMonthly: "₹1,666",
    inrAnnualTotal: "₹19,990/yr",
    inrSaving: "Save ₹3,998",
    usdMonthly: "$29",
    usdAnnualMonthly: "$24",
    usdAnnualTotal: "$290/yr",
    usdSaving: "Save $58",
    features: [
      "120 minutes/month",
      "Up to 3-min videos",
      "720p · 9:16 Shorts/Reels",
      "No watermark",
      "Limited scene breakdown",
      "30-day video history",
      "Top-up minutes",
    ],
    cta: "Get Started",
  },
  {
    name: "STARTER",
    minutes: "200",
    maxLength: "5 min",
    inrMonthly: "₹2,999",
    inrAnnualMonthly: "₹2,499",
    inrAnnualTotal: "₹29,990/yr",
    inrSaving: "Save ₹5,998",
    usdMonthly: "$49",
    usdAnnualMonthly: "$41",
    usdAnnualTotal: "$490/yr",
    usdSaving: "Save $98",
    features: [
      "200 minutes/month",
      "Up to 5-min videos",
      "720p · 9:16 Shorts/Reels",
      "Scene breakdown + basic editing",
      "Limited web research",
      "60-day video history",
      "Top-up minutes",
    ],
    cta: "Get Started",
  },
  {
    name: "GROWTH",
    minutes: "500",
    maxLength: "15 min",
    inrMonthly: "₹5,599",
    inrAnnualMonthly: "₹4,666",
    inrAnnualTotal: "₹55,990/yr",
    inrSaving: "Save ₹11,198",
    usdMonthly: "$89",
    usdAnnualMonthly: "$74",
    usdAnnualTotal: "$890/yr",
    usdSaving: "Save $178",
    features: [
      "500 minutes/month",
      "Up to 15-min videos",
      "1080p + 16:9 YouTube format",
      "Timeline editing",
      "Web research + visual fetch",
      "Save 3 characters to library",
      "Multi-output · Multi-character",
      "1-year video history",
      "2 team seats · 24h email support",
    ],
    highlighted: true,
    cta: "Get Started",
  },
  {
    name: "PRO",
    minutes: "1,000",
    maxLength: "30 min",
    inrMonthly: "₹9,999",
    inrAnnualMonthly: "₹8,333",
    inrAnnualTotal: "₹99,990/yr",
    inrSaving: "Save ₹19,998",
    usdMonthly: "$149",
    usdAnnualMonthly: "$124",
    usdAnnualTotal: "$1,490/yr",
    usdSaving: "Save $298",
    features: [
      "1,000 minutes/month",
      "Up to 30-min videos",
      "1080p + all formats",
      "Premium AI visuals",
      "Batch generation (50/batch)",
      "REST API access",
      "Save 5 characters",
      "Forever video history",
      "5 team seats · Chat support",
    ],
    cta: "Get Started",
  },
  {
    name: "ULTIMATE",
    minutes: "2,000",
    maxLength: "45 min",
    inrMonthly: "₹14,999",
    inrAnnualMonthly: "₹12,499",
    inrAnnualTotal: "₹1,49,990/yr",
    inrSaving: "Save ₹29,998",
    usdMonthly: "$249",
    usdAnnualMonthly: "$208",
    usdAnnualTotal: "$2,490/yr",
    usdSaving: "Save $498",
    features: [
      "2,000 minutes/month",
      "Up to 45-min videos",
      "1080p + all formats",
      "Batch generation (500/batch)",
      "REST API access",
      "Save 10 characters",
      "Forever video history",
      "10 team seats · Phone support",
    ],
    cta: "Contact Us",
  },
];

// ─── Toggle pill ─────────────────────────────────────────────────────────────

function TogglePill<T extends string>({
  options,
  value,
  onChange,
  badge,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
  badge?: { forValue: T; text: string };
}) {
  return (
    <div className="flex items-center rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1a1a24] p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`relative flex items-center gap-1.5 rounded-lg px-4 py-2 font-body text-sm font-medium transition-all duration-200 ${
            value === opt.value
              ? "bg-[#111118] text-[#e8e8f0] shadow-sm"
              : "text-[#6b6b80] hover:text-[#e8e8f0]"
          }`}
        >
          {opt.label}
          {badge && badge.forValue === opt.value && (
            <span className="rounded-full bg-[#ff2d55] px-1.5 py-0.5 font-mono text-[10px] text-white leading-none">
              {badge.text}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Pricing card ────────────────────────────────────────────────────────────

function PricingCard({
  plan,
  billing,
  currency,
  onCtaClick,
}: {
  plan: Plan;
  billing: Billing;
  currency: Currency;
  onCtaClick?: () => void;
}) {
  const isAnnual = billing === "annual";
  const isINR = currency === "inr";
  const isFree = plan.name === "FREE";

  const displayPrice = isAnnual && !isFree
    ? (isINR ? plan.inrAnnualMonthly : plan.usdAnnualMonthly)
    : (isINR ? plan.inrMonthly : plan.usdMonthly);

  const annualTotal = isINR ? plan.inrAnnualTotal : plan.usdAnnualTotal;
  const saving = isINR ? plan.inrSaving : plan.usdSaving;

  return (
    <div
      className={`relative flex flex-col rounded-xl border p-6 transition-all duration-200 ${
        plan.highlighted
          ? "z-10 scale-[1.03] border-[#ff2d55] bg-[#1a1a24] shadow-[0_0_50px_rgba(255,45,85,0.2)]"
          : "border-[rgba(255,255,255,0.07)] bg-[#111118] hover:border-[rgba(255,255,255,0.15)]"
      }`}
    >
      {/* Top badge */}
      {plan.highlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#ff2d55] px-4 py-1 font-mono text-[11px] font-semibold uppercase tracking-widest text-white shadow-[0_0_16px_rgba(255,45,85,0.5)]">
          ⭐ Most Popular
        </div>
      )}

      {/* Plan name + minutes */}
      <div className="mb-5">
        <p className="font-mono text-xs uppercase tracking-[3px] text-[#6b6b80]">{plan.name}</p>
        <div className="mt-3 flex items-end gap-1.5">
          <span
            className={`font-display leading-none tracking-wide ${
              plan.highlighted ? "text-6xl text-[#e8e8f0]" : "text-5xl text-[#e8e8f0]"
            }`}
          >
            {displayPrice}
          </span>
          {!isFree && (
            <span className="mb-1.5 font-body text-sm text-[#6b6b80]">/mo</span>
          )}
        </div>
        {isAnnual && !isFree && annualTotal && (
          <p className="mt-1 font-body text-xs text-[#6b6b80]">{annualTotal}</p>
        )}
        {isAnnual && saving && (
          <span className="mt-2 inline-block rounded-full bg-[rgba(48,209,88,0.12)] px-2.5 py-1 font-mono text-[11px] text-[#30d158]">
            {saving}
          </span>
        )}
      </div>

      {/* Minutes highlight */}
      <div
        className={`mb-5 rounded-lg px-4 py-2.5 text-center ${
          plan.highlighted
            ? "bg-[rgba(255,45,85,0.12)] border border-[rgba(255,45,85,0.2)]"
            : "bg-[rgba(255,255,255,0.04)]"
        }`}
      >
        <span
          className={`font-body text-sm font-semibold ${
            plan.highlighted ? "text-[#ff2d55]" : "text-[#e8e8f0]"
          }`}
        >
          {plan.minutes} min/mo
        </span>
        <span className="ml-2 font-body text-xs text-[#6b6b80]">· max {plan.maxLength}</span>
      </div>

      {/* Features */}
      <ul className="mb-6 flex flex-col gap-2.5">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5 font-body text-sm text-[#e8e8f0]">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              className="mt-0.5 shrink-0"
            >
              <path
                d="M3 8l3.5 3.5L13 5"
                stroke="#30d158"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {f}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={plan.cta !== "Contact Us" ? onCtaClick : undefined}
        className={`mt-auto w-full rounded-xl py-3.5 font-body font-semibold transition-all duration-200 ${
          plan.highlighted
            ? "btn-red-glow"
            : plan.cta === "Contact Us"
            ? "border border-[rgba(191,90,242,0.4)] text-[#bf5af2] hover:bg-[rgba(191,90,242,0.08)]"
            : "border border-[rgba(255,255,255,0.12)] text-[#e8e8f0] hover:border-[rgba(255,255,255,0.3)] hover:bg-[rgba(255,255,255,0.04)]"
        }`}
      >
        {plan.cta}
      </button>
    </div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────

export default function PricingSection({ onCtaClick }: { onCtaClick?: () => void }) {
  const [billing, setBilling] = useState<Billing>("monthly");
  const [currency, setCurrency] = useState<Currency>("inr");

  return (
    <section id="pricing" className="bg-[#111118] px-5 py-24">
      <div className="mx-auto max-w-7xl">

        {/* Heading */}
        <div className="mb-12 text-center">
          <h2 className="font-display text-5xl tracking-wider text-[#e8e8f0] sm:text-6xl">
            SIMPLE <span className="gradient-text">PRICING</span>
          </h2>
          <p className="mt-4 font-body text-[#6b6b80]">
            Start free. Scale as you grow. Pay in INR or USD.
          </p>
        </div>

        {/* Toggles */}
        <div className="mb-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <TogglePill<Billing>
            options={[
              { label: "Monthly", value: "monthly" },
              { label: "Annual", value: "annual" },
            ]}
            value={billing}
            onChange={setBilling}
            badge={{ forValue: "annual", text: "−2 mo" }}
          />
          <TogglePill<Currency>
            options={[
              { label: "₹ INR", value: "inr" },
              { label: "$ USD", value: "usd" },
            ]}
            value={currency}
            onChange={setCurrency}
          />
        </div>

        {/* Cards — 1 col → 2 col → 3 col → 6 col */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {PLANS.map((plan) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              billing={billing}
              currency={currency}
              onCtaClick={onCtaClick}
            />
          ))}
        </div>

        <p className="mt-10 text-center font-body text-sm text-[#6b6b80]">
          India payments via Razorpay &nbsp;·&nbsp; International via Stripe
        </p>
      </div>
    </section>
  );
}
