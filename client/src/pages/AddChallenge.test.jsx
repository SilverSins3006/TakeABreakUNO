/**
 * @file Tests for the AddChallenge page: the authentication redirect, a
 * successful challenge submission, and the error path when the server
 * rejects the challenge.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddChallenge from "./AddChallenge";

const { mockNavigate, mockUseAuth0 } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockUseAuth0: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("@auth0/auth0-react", () => ({
  useAuth0: () => mockUseAuth0(),
}));

describe("AddChallenge", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockUseAuth0.mockReturnValue({
      user: { sub: "user-123" },
      isAuthenticated: true,
      isLoading: false,
    });
    global.alert = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("redirects unauthenticated users to /account", () => {
    mockUseAuth0.mockReturnValue({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });

    render(<AddChallenge />);

    expect(mockNavigate).toHaveBeenCalledWith("/account", { replace: true });
  });

  it("submits a new challenge and clears the form on success", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 1 }),
    });

    render(<AddChallenge />);

    fireEvent.change(
      screen.getByPlaceholderText("Enter the challenge title..."),
      { target: { value: "Do a lap around the block" } },
    );
    fireEvent.change(
      screen.getByPlaceholderText("Enter the challenge description..."),
      { target: { value: "Walk briskly for 5 minutes" } },
    );

    fireEvent.click(screen.getByRole("button", { name: "Save Challenge" }));

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    const [url, options] = global.fetch.mock.calls[0];
    expect(url).toContain("/api/challenges");
    const body = JSON.parse(options.body);
    expect(body).toMatchObject({
      userId: "user-123",
      title: "Do a lap around the block",
      description: "Walk briskly for 5 minutes",
      difficulty: "Easy",
      type: "Exercise",
    });

    await waitFor(() =>
      expect(global.alert).toHaveBeenCalledWith(
        "Challenge added successfully!",
      ),
    );
    expect(
      screen.getByPlaceholderText("Enter the challenge title..."),
    ).toHaveValue("");
  });

  it("shows an error alert when the server rejects the challenge", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: "Title is required" }),
    });

    render(<AddChallenge />);

    fireEvent.click(screen.getByRole("button", { name: "Save Challenge" }));

    await waitFor(() =>
      expect(global.alert).toHaveBeenCalledWith(
        "Failed to add challenge: Title is required",
      ),
    );
  });
});