import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

export default function Logout(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const deleteSession = async () => {
    const response = await fetch("/logout");
    const body = await response.text();
    const parsed = JSON.parse(body);
    if (parsed.success) {
      dispatch({ type: "LOGOUT" });
      props.onLogout();
      history.push("/");
    }
  };
  useEffect(() => {
    deleteSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div></div>;
}
