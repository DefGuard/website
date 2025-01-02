import "./style.scss";

import clsx from "clsx";
import { useMemo, useState } from "react";
import Markdown from "react-markdown";
import rehypeR from "rehype-raw";

import type { PricingSchema } from "../../content.config";
import PricingToggle from "./components/PricingToggle/PricingToggle";

type PricingData = PricingSchema & { content: string | undefined; id: string | number };

type PricingProps = {
  data: PricingData[];
};

enum PricingPlan {
  ANNUAL,
  MONTHLY,
}

enum SupportPlan {
  NO_SUPPORT,
  SUPPORT,
}

export const PricingCards = ({ data }: PricingProps) => {
  const annualEnabled = useMemo(
    () => data.filter((p) => p.annualPrice !== undefined).length > 0,
    [data],
  );

  const [support, setSupport] = useState(SupportPlan.NO_SUPPORT);

  return (
    <div id="pricing-container">
      {annualEnabled && (
        <PricingToggle
          value={support}
          left={SupportPlan.NO_SUPPORT}
          right={SupportPlan.SUPPORT}
          onChange={setSupport}
          labels={{
            left: "Without Support",
            right: "With Support",
          }}
        />
      )}
      <p className="plan-notice">
        {support === SupportPlan.SUPPORT && (
          <span>
            You are just buying the Enterprise License without possibility to contact the
            development team directly. You still can use community support on our Matrix
            Channel or through GitHub Issues.
          </span>
        )}
        {support === SupportPlan.NO_SUPPORT && (
          <span>
            You are buying the Enterprise license and you can contact directly our
            development team by Email/Ticketing system for assistance.
          </span>
        )}
      </p>
      <div className="plans">
        {data.map((pricingData) => (
          <PricingCard
            data={pricingData}
            key={pricingData.id}
            support={support === SupportPlan.SUPPORT}
          />
        ))}
      </div>
    </div>
  );
};

type CardProps = {
  data: PricingData;
  support: boolean;
};

const PricingCard = ({ data, support }: CardProps) => {
  const [pricingPlan, setPricingPlan] = useState(PricingPlan.MONTHLY);
  const isAnnual = pricingPlan === PricingPlan.ANNUAL && data.annualPrice !== undefined;

  return (
    <div className="pricing-card">
      <div className="header">
        <p className="name">{data.name}</p>
      </div>
      <div className="divider">
        <div className="line"></div>
      </div>
      <div className="pricing-container">
        {data.annualPrice !== undefined && data.annualPriceLink !== undefined && (
          <PricingToggle
            size="small"
            labels={{
              left: "Monthly",
              right: "Annual",
            }}
            left={PricingPlan.MONTHLY}
            right={PricingPlan.ANNUAL}
            value={pricingPlan}
            onChange={setPricingPlan}
          />
        )}
        <div
          className={clsx("price", {
            free: data.price === 0,
            spaced: data.price === 0 || !isAnnual,
          })}
        >
          {data.price > 0 && pricingPlan === PricingPlan.MONTHLY && (
            <p className="monthly">
              €{data.price}
              <span> per month</span>
            </p>
          )}
          {data.price > 0 && pricingPlan === PricingPlan.ANNUAL && (
            <p className="annual">
              <span>€{data.price}</span>
              <span>€{data.annualPrice}</span>
            </p>
          )}
          {data.price === 0 && <p className="free">Free</p>}
        </div>
        {isAnnual && data.annualPrice !== undefined && (
          <p className="annual-message">
            per month, billed annually you will be charged €{data.annualPrice * 12}
          </p>
        )}
        <div className="action-container">
          <a
            className="action"
            target={data.linkTarget ?? "_blank"}
            href={isAnnual ? data.annualPriceLink : data.priceLink}
          >
            <span>{data.buttonText}</span>
          </a>
        </div>
      </div>
      <div className="divider">
        <div className="line" />
      </div>
      {data.content !== undefined && (
        <div className="content-container">
          <Markdown rehypePlugins={[rehypeR]}>{data.content}</Markdown>
        </div>
      )}
    </div>
  );
};
