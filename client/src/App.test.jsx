/**
 * @file Test for App's top-level authentication error handling: when
 * Auth0 reports a login error, the app shell should not render, and the
 * user should see a readable error message instead.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "./App";

vi.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({
    isLoading: false,
    error: { message: "Login required" },
    isAuthenticated: false,
    user: null,
  }),
}));

describe("App authentication error handling", () => {
  it("shows an authentication error message instead of the app shell", () => {
    render(<App />);

    expect(screen.getByText(/Authentication Error/)).toBeInTheDocument();
    expect(screen.getByText(/Login required/)).toBeInTheDocument();
  });
});