import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import GoogleApiWrapper from "./GoogleMap.jsx";
import CustomizedSnackbars from "../shared/Snackbar.jsx";
import Search from "../shared/Search.jsx";

export default function ContactUs() {
  const initialState = {
    name: "",
    email: "",
    phone: "",
    message: "",
  };
  const [contact, setContact] = useState(initialState);
  const initialSnack = { isOpen: false, msg: "", severity: "" };
  const [snack, setSnack] = useState(initialSnack);
  const { t } = useTranslation();

  const handleContact = async (evt) => {
    evt.preventDefault();
    let data = new FormData();
    data.append("contact", JSON.stringify(contact));
    let response = await fetch("/contact", { method: "POST", body: data });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      setContact(initialState);
      setSnack({ isOpen: true, msg: body.msg, severity: "success" });
      return;
    }
    setSnack({ isOpen: true, msg: body.msg, severity: "error" });
    return;
  };
  return (
    <div className="ContactUs">
      <Search />
      <div className="pageTitle">{t("ContactUs.pageTitle")}</div>
      <div className="contactUs-contents">
        <div className="address">
          <div>
            <div className="title">{t("ContactUs.call-us")}: </div>
            <div className="text">
              514-848-2424, {t("ContactUs.ext")} 2676, 2609, 2608
            </div>
            <div className="title">{t("ContactUs.email-us")}: </div>
            <div className="text">public.library@concordia.ca</div>
            <div className="title">{t("ContactUs.mailing-address")}: </div>
            <div className="text">{t("ContactUs.public-library")}</div>
            <div className="text">{t("ContactUs.address")}</div>
            <div className="text">{t("ContactUs.city")}</div>
            <div className="text">H2Z 3F4 </div>
          </div>
          <GoogleApiWrapper />
        </div>

        <form className="contact-form" onSubmit={handleContact}>
          <div className="title">
            {t("ContactUs.fields-listed-in")}{" "}
            <span className="red">{t("ContactUs.red")}</span>{" "}
            {t("ContactUs.are-mandatory")}
          </div>
          <div>{t("ContactUs.name")}:</div>
          <input
            type="text"
            value={contact.name}
            onChange={(e) => setContact({ ...contact, name: e.target.value })}
          />
          <div className="red">Email:</div>
          <input
            type="email"
            value={contact.email}
            onChange={(e) => setContact({ ...contact, email: e.target.value })}
            required
          />
          <div>{t("ContactUs.phone")}:</div>
          <input
            type="text"
            value={contact.phone}
            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
          />
          <div className="red">Message:</div>
          <textarea
            type="text"
            value={contact.message}
            onChange={(e) =>
              setContact({ ...contact, message: e.target.value })
            }
            className="textarea"
            rows={6}
            cols={20}
            required
          ></textarea>
          <button type="submit" className="submit">
            {t("ContactUs.submit")}
          </button>
        </form>
      </div>
      {snack.isOpen && (
        <CustomizedSnackbars
          isOpen={snack.isOpen}
          msg={snack.msg}
          severity={snack.severity}
          onClose={() => setSnack(initialSnack)}
        />
      )}
    </div>
  );
}
