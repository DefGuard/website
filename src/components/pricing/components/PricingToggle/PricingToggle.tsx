import "./style.scss";

import clsx from "clsx";

type Props<A, B> = {
  value: A | B;
  left: A;
  right: B;
  labels: {
    left: string;
    right: string;
  };
  size?: "small" | "standard";
  onChange: (value: A | B) => void;
};

const PricingToggle = <A, B>({
  left,
  onChange,
  right,
  value,
  labels,
  size = "standard",
}: Props<A, B>) => {
  return (
    <div className={clsx("pricing-toggle", `size-${size}`)}>
      <button
        className={clsx({
          active: value === left,
        })}
        onClick={() => {
          onChange(left);
        }}
      >
        {labels.left}
      </button>
      <button
        className={clsx({
          active: value === right,
        })}
        onClick={() => {
          onChange(right);
        }}
      >
        {labels.right}
      </button>
    </div>
  );
};

export default PricingToggle;
