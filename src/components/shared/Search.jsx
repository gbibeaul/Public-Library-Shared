import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Search() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [search, setSearch] = useState({ input: "", searchOn: "title" });

  const handleSearch = (evt) => {
    evt.preventDefault();
    dispatch({
      type: "SEARCH",
      searchQ: search,
    });
    setSearch({ ...search, input: "" });
    history.push("/ItemsList");
  };

  return (
    <div className="search">
      <form onSubmit={handleSearch} className="search-contents">
        <span>{t("Search.search")}:</span>
        <input
          className="input"
          type="text"
          value={search.input}
          placeholder={t("Search.placeHolder")}
          onChange={(e) => setSearch({ ...search, input: e.target.value })}
        />
        <select
          className="select"
          onChange={(e) => setSearch({ ...search, searchOn: e.target.value })}
        >
          <option value="title">{t("Search.title")}</option>
          <option value="authors">{t("Search.author")}</option>
          <option value="longDescription">{t("Search.des")}</option>
        </select>
        <button type="submit" className="btn">
          {t("Search.submit")}
        </button>
      </form>
    </div>
  );
}
