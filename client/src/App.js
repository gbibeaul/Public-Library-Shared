import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Route } from "react-router-dom";
import "./css/App.css";
import Navbar from "./components/shared/Navbar.jsx";
import Footer from "./components/shared/Footer.jsx";
import PoweredBy from "./components/shared/PoweredBy.jsx";
import Logo from "./components/shared/Logo.jsx";
import Home from "./components/home/Home.jsx";
import Login from "./components/authentications/Login.jsx";
import Logout from "./components/authentications/Logout.jsx";
import SignUp from "./components/authentications/SignUp.jsx";
import ItemsList from "./components/archive/ItemsList.jsx";
import ItemDetails from "./components/archive/ItemDetails.jsx";
import Profile from "./components/shared/Profile.jsx";
import ContactUs from "./components/contact-us/ContactUs.jsx";
import Events from "./components/events/Events.jsx";
import Services from "./components/services/Services.jsx";

function App() {
  const dispatch = useDispatch();
  const activeSessionCheck = async () => {
    const response = await fetch("/sessions");
    const body = await response.text();
    const parsed = JSON.parse(body);
    if (parsed.success) {
      dispatch({
        type: "LOGIN",
        username: parsed.email,
        name: parsed.name,
        userId: parsed.id,
      });
    }
  };
  const getItems = async () => {
    let response = await fetch("/items");
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      await dispatch({
        type: "GET_ITEMS",
        items: body.items,
      });
      return;
    }
  };

  useEffect(() => {
    getItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    activeSessionCheck();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BrowserRouter className="wrapper">
      <div className="app">
        <Navbar />
        <Logo />
        <Route exact path="/" component={Home}></Route>
        <Route exact path="/Login" component={Login}></Route>
        <Route exact path="/Logout" component={Logout}></Route>
        <Route exact path="/SignUp" component={SignUp}></Route>
        <Route exact path="/ItemsList" component={ItemsList}></Route>
        <Route
          exact
          path="/Item-Details/:itemId"
          component={ItemDetails}
        ></Route>
        <Route exact path="/Profile/:userId" component={Profile}></Route>
        <Route exact path="/Contact-Us" component={ContactUs}></Route>
        <Route exact path="/Events" component={Events}></Route>
        <Route exact path="/Services" component={Services}></Route>
        {/* <Footer /> */}
        <PoweredBy />
      </div>
    </BrowserRouter>
  );
}

export default App;
