import React from "react";
import { useTranslation } from "react-i18next";
import Search from "../shared/Search.jsx";

export default function Events() {
  const { t } = useTranslation();
  return (
    <div className="Events">
      <Search />
      <div className="pageTitle">{t("Events.pageTitle")}</div>
      <div className="events-contents">
        <img src={t("Events.img")} alt=""></img>
        <div className="events-text">{t("Events.text")}</div>
      </div>
    </div>
  );
}
