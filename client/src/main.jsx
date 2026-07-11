/**
 * @file React application bootstrap.
 * @brief Sets up the Auth0 provider and renders the root application.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import "./App.css";
import { Auth0Provider } from "@auth0/auth0-react";

// DIAGNOSTIC LOG: This will print your variables to the browser console so we can see what's missing
console.log("Vite Env Check:", import.meta.env);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN || "FALLBACK_NOT_FOUND"}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID || "FALLBACK_NOT_FOUND"}
      authorizationParams={{ redirect_uri: window.location.origin }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>,
);
