import React from "react";
import Search from "../shared/Search.jsx";
import MenuBar from "./MenuBar.jsx";
import HomeContents from "./HomeContents";

export default function Home() {
  return (
    <div className="Home">
      <Search />
      <MenuBar />
      <img src="/Images/bg.jpg" alt="" className="bg" />
      <HomeContents />
    </div>
  );
}
