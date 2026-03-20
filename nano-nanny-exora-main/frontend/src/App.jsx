import React from "react";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";

const App = ({ children }) => {
  return (
    <AuthProvider>
      <div className="app-container">
        <Navbar />
        <main className="page-body">
          {children}
        </main>
        <footer className="footer">
          © 2025 NanoNanny — Post-Recovery Monitoring System &nbsp;·&nbsp;
          <a href="#">Privacy</a> &nbsp;·&nbsp; <a href="#">Terms</a> &nbsp;·&nbsp;
          <a href="#">Support</a>
        </footer>
      </div>
    </AuthProvider>
  );
};

export default App;
