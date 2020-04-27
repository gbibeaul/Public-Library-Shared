import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
export default function Logo() {
  const { t } = useTranslation();

  return (
    <Link to="/">
      <img src={t("logo")} alt="" className="logo" />
    </Link>
  );
}
