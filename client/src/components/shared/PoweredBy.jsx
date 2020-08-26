import React from "react";
import { useTranslation } from "react-i18next";

export default function PoweredBy() {
  const { t } = useTranslation();

  return <div className="PoweredBy">{t("PoweredBy")}</div>;
}
