import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function MenuBar() {
  const { t } = useTranslation();
  return (
    <div className="MenuBar">
      <Link to="/">{t("MenuBar.1")}</Link>
      <Link to="/ItemsList"> {t("MenuBar.2")}</Link>
      <Link to="/Services"> {t("MenuBar.3")}</Link>
      <Link to="/Events"> {t("MenuBar.4")}</Link>
      <Link to="/Contact-Us"> {t("MenuBar.5")}</Link>
    </div>
  );
}
