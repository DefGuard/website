import "./style.scss";
import "react-multi-carousel/lib/styles.css";

import { useDrag } from "@use-gesture/react";
import clsx from "clsx";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

const startThreshold = 0.0;

const endThreshold = 1;

const PricingArrow = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={48}
      height={48}
      viewBox="0 0 48 48"
      fill="none"
    >
      <rect x={0.5} y={0.5} width={47} height={47} rx={23.5} fill="white" />
      <rect x={0.5} y={0.5} width={47} height={47} rx={23.5} stroke="#222222" />
      <path
        d="M25.5115 14.0076L35.5039 24M35.5039 24L25.5115 33.9924M35.5039 24H12.4961"
        stroke="black"
      />
    </svg>
  );
};

export const PricingCards = ({ data }: PricingProps) => {
  const plansRef = useRef<HTMLDivElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [showLeftGradient, setShowLeftGradient] = useState(false);
  const [showRightGradient, setShowRightGradient] = useState(false);

  const bind = useDrag(({ delta }) => {
    const element = plansRef.current;
    if (element) {
      element.scrollLeft -= delta[0];
    }
  });

  const [support, setSupport] = useState(SupportPlan.NO_SUPPORT);

  const pricingData = useMemo(() => {
    if (support) {
      return data.filter((d) => d.supported);
    }
    return data.filter((d) => !d.supported);
  }, [data, support]);

  const updateScrollProgress = useCallback(() => {
    const element = plansRef.current;
    if (element) {
      const { scrollLeft, scrollWidth, clientWidth } = element;
      const progress = scrollLeft / (scrollWidth - clientWidth);
      const left = progress > startThreshold;
      const right = progress < endThreshold;
      setShowLeftGradient(left);
      setShowRightGradient(right);
      setShowLeftArrow(left);
      setShowRightArrow(right);
    }
  }, []);

  const centerPlansScroll = useCallback(() => {
    if (plansRef.current) {
      plansRef.current.scrollLeft =
        (plansRef.current.scrollWidth - plansRef.current.clientWidth) / 2;
    }
  }, []);

  const handleScrollEvent = useCallback(() => {
    frameRef.current = requestAnimationFrame(updateScrollProgress);
  }, [updateScrollProgress]);

  //scroll to next card in given direction
  const handleArrowEvent = useCallback((direction: "left" | "right") => {
    const plans = plansRef.current;
    const scrollContainer = plans;
    if (!plans || !scrollContainer) return;
    const scrollRect = scrollContainer.getBoundingClientRect();
    let pricingCards = Array.from(plans.children);
    let lastOutside: Element | null = null;
    if (direction === "right") {
      pricingCards = pricingCards.reverse();
    }
    const scrollPadding = 50;
    const scrollContainerRight = scrollRect.right;
    const scrollContainerLeft = scrollRect.left;
    if (direction === "right") {
      for (const card of pricingCards) {
        const cardRect = card.getBoundingClientRect();
        const partialIn =
          cardRect.left < scrollContainerRight && cardRect.right >= scrollContainerRight;
        const outsideFull = cardRect.left > scrollContainerRight;
        if (partialIn || outsideFull) {
          lastOutside = card;
        }
        const fullInside =
          cardRect.left > scrollContainerLeft && cardRect.right <= scrollContainerRight;
        if ((partialIn || fullInside) && lastOutside !== null) {
          const outsideRect = lastOutside.getBoundingClientRect();
          const scrollBy =
            outsideRect.x -
            scrollRect.width -
            scrollRect.x +
            outsideRect.width +
            scrollPadding;
          scrollContainer.scrollBy({
            left: scrollBy,
            behavior: "smooth",
          });
          break;
        }
      }
    }
    if (direction === "left") {
      for (const card of pricingCards) {
        const cardRect = card.getBoundingClientRect();
        const partialIn =
          cardRect.right > scrollContainerLeft && cardRect.left <= scrollContainerLeft;
        const outsideFull = cardRect.right < scrollContainerLeft;
        if (partialIn || outsideFull) {
          lastOutside = card;
        }
        const fullInside =
          cardRect.left > scrollContainerLeft && cardRect.right <= scrollContainerRight;
        if ((partialIn || fullInside) && lastOutside !== null) {
          const outsideRect = lastOutside.getBoundingClientRect();
          const scrollBy = (scrollRect.x - outsideRect.x + scrollPadding) * -1;
          scrollContainer.scrollBy({
            left: scrollBy,
            behavior: "smooth",
          });
          break;
        }
      }
    }
  }, []);

  useEffect(() => {
    centerPlansScroll();
    handleScrollEvent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [support]);

  useEffect(() => {
    centerPlansScroll();
    // on mount calc the correct state
    handleScrollEvent();
    plansRef.current?.addEventListener("scroll", handleScrollEvent);
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      plansRef.current?.removeEventListener("scroll", handleScrollEvent);
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div id="pricing-container">
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
      <div className="scroll-container">
        <div className="plans" ref={plansRef} {...bind()}>
          {pricingData.map((pricingData) => (
            <PricingCard
              data={pricingData}
              key={pricingData.id}
              support={support === SupportPlan.SUPPORT}
            />
          ))}
        </div>
        {showLeftGradient && <div className="gradient left"></div>}
        {showRightGradient && <div className="gradient right"></div>}
        {showLeftArrow && (
          <button
            className="arrow left"
            onClick={() => {
              handleArrowEvent("left");
            }}
          >
            <PricingArrow />
          </button>
        )}
        {showRightArrow && (
          <button
            className="arrow right"
            onClick={() => {
              handleArrowEvent("right");
            }}
          >
            <PricingArrow />
          </button>
        )}
      </div>
    </div>
  );
};

type CardProps = {
  data: PricingData;
  support: boolean;
};

const PricingCard = ({ data }: CardProps) => {
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
            spaced: data.price === 0 || !isAnnual || data.annualPrice === undefined,
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
