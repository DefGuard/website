import clsx from "clsx";

import { LicenseBadgeVariant } from "./types";

type Props = {
  variant: LicenseBadgeVariant;
};

const LicenseBadgeReact = ({ variant }: Props) => {
  const text = () => {
    switch (variant) {
      case LicenseBadgeVariant.OPEN_SOURCE:
        return "open source";
      case LicenseBadgeVariant.ENTERPRISE:
        return "enterprise";
    }
  };
  return (
    <div
      className={clsx("license-badge", {
        "v-enterprise": variant === LicenseBadgeVariant.ENTERPRISE,
        "v-open-source": variant === LicenseBadgeVariant.OPEN_SOURCE,
      })}
    >
      <p>{text()}</p>
    </div>
  );
};

export default LicenseBadgeReact;
