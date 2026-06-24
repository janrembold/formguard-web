import { useMemo, useState } from "preact/hooks";
import {
  plans,
  priceWithAi,
  yearlyTotal,
  monthlyWhenYearly,
} from "../../data/plans";
import styles from "./PricingCalculator.module.scss";

export interface CalculatorStrings {
  requests: string;
  billing: string;
  monthly: string;
  yearly: string;
  yearlyHint: string;
  ai: string;
  aiOff: string;
  aiOn: string;
  aiHint: string;
  yourPlan: string;
  perMonth: string;
  perMonthYearly: string;
  billedYearly: string;
  custom: string;
  customNote: string;
  cta: string;
  ctaEnterprise: string;
  mostPopular: string;
  save: string;
}

interface Props {
  lang: "de" | "en";
  loginUrl: string;
  strings: CalculatorStrings;
}

export default function PricingCalculator({ lang, loginUrl, strings }: Props) {
  const [index, setIndex] = useState(2); // default: Business
  const [withAi, setWithAi] = useState(false);
  const [yearly, setYearly] = useState(false);

  const numberFmt = useMemo(
    () => new Intl.NumberFormat(lang === "de" ? "de-DE" : "en-US"),
    [lang],
  );

  const plan = plans[index];
  const isEnterprise = plan.enterprise || plan.priceMonthly === null;

  const base = plan.priceMonthly ?? 0;
  const monthlyPrice = priceWithAi(base, withAi);
  const displayPrice = yearly ? monthlyWhenYearly(monthlyPrice) : monthlyPrice;
  const annual = yearlyTotal(monthlyPrice);

  const formatEuro = (value: number) => `${numberFmt.format(value)} €`;

  return (
    <div class={styles.calc}>
      <div class={styles.controls}>
        {/* Requests slider */}
        <div class={styles.control}>
          <label class={styles.label} for="req-range">
            {strings.requests}
          </label>
          <output class={styles.requestsValue}>
            {isEnterprise
              ? `${numberFmt.format(plan.requests)}+`
              : numberFmt.format(plan.requests)}
          </output>
          <input
            id="req-range"
            class={styles.range}
            type="range"
            min={0}
            max={plans.length - 1}
            step={1}
            value={index}
            onInput={(e) =>
              setIndex(Number((e.target as HTMLInputElement).value))
            }
            aria-valuetext={plan.name}
          />
          <div class={styles.ticks} aria-hidden="true">
            {plans.map((p, i) => (
              <button
                type="button"
                key={p.id}
                class={`${styles.tick} ${i === index ? styles.tickActive : ""}`}
                onClick={() => setIndex(i)}
                tabIndex={-1}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {/* AI toggle */}
        <div class={styles.control}>
          <span class={styles.label}>{strings.ai}</span>
          <div class={styles.segmented} role="group" aria-label={strings.ai}>
            <button
              type="button"
              class={`${styles.segment} ${!withAi ? styles.segmentActive : ""}`}
              aria-pressed={!withAi}
              onClick={() => setWithAi(false)}
            >
              {strings.aiOff}
            </button>
            <button
              type="button"
              class={`${styles.segment} ${withAi ? styles.segmentActive : ""}`}
              aria-pressed={withAi}
              onClick={() => setWithAi(true)}
            >
              {strings.aiOn}
            </button>
          </div>
          <p class={styles.hint}>{strings.aiHint}</p>
        </div>

        {/* Billing toggle */}
        <div class={styles.control}>
          <span class={styles.label}>{strings.billing}</span>
          <div
            class={styles.segmented}
            role="group"
            aria-label={strings.billing}
          >
            <button
              type="button"
              class={`${styles.segment} ${!yearly ? styles.segmentActive : ""}`}
              aria-pressed={!yearly}
              onClick={() => setYearly(false)}
            >
              {strings.monthly}
            </button>
            <button
              type="button"
              class={`${styles.segment} ${yearly ? styles.segmentActive : ""}`}
              aria-pressed={yearly}
              onClick={() => setYearly(true)}
            >
              {strings.yearly}
              <span class={styles.saveBadge}>{strings.yearlyHint}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Result */}
      <div
        class={`${styles.result} ${plan.popular ? styles.resultPopular : ""}`}
      >
        {plan.popular && (
          <span class={styles.popularBadge}>{strings.mostPopular}</span>
        )}
        <span class={styles.resultPlan}>{strings.yourPlan}</span>
        <span class={styles.resultName}>{plan.name}</span>

        {isEnterprise ? (
          <>
            <span class={styles.resultPrice}>{strings.custom}</span>
            <p class={styles.resultNote}>{strings.customNote}</p>
            <a class={styles.ctaEnterprise} href={loginUrl} rel="noopener">
              {strings.ctaEnterprise}
            </a>
          </>
        ) : (
          <>
            <span class={styles.resultPrice}>
              {formatEuro(displayPrice)}
              <span class={styles.resultPer}>
                {yearly ? strings.perMonthYearly : strings.perMonth}
              </span>
            </span>
            <p class={styles.resultNote}>
              {yearly
                ? strings.billedYearly.replace("{amount}", formatEuro(annual))
                : "\u00A0"}
            </p>
            <a class={styles.cta} href={loginUrl} rel="noopener">
              {strings.cta}
            </a>
          </>
        )}
      </div>
    </div>
  );
}
