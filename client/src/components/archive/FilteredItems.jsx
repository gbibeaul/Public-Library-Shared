import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import React from "react";

export default function FilteredItems(props) {
  const { t } = useTranslation();

  return (
    <div className="resposive">
      <div className="gallery">
        <div> {props.item.title}</div>
        <img src={props.item.thumbnailUrl} alt="" />
        <div className="des">
          {props.item.authors.map((author, index) => (
            <span key={index}>
              {author}
              {props.item.authors.length > 0 &&
                index + 1 !== props.item.authors.length &&
                ","}
            </span>
          ))}
        </div>
        {props.item.availability ? (
          <div className="green left bottom">
            {t("FilteredItems.Item-available")}
          </div>
        ) : (
          <div className="red left bottom">
            {t("FilteredItems.Item-unavailable")}
          </div>
        )}
        <Link
          to={"/Item-Details/" + props.item._id}
          className="bottom right blue"
        >
          {t("FilteredItems.more")}
        </Link>
      </div>
    </div>
  );
}
