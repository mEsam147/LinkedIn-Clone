import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-base-100 w-full">
      <Navbar />
      <main className="max-w-7xl mx-auto">{children}</main>
    </div>
  );
};

export default Layout;
