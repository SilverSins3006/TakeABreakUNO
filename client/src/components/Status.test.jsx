/**
 * @file Tests for the Status component's challenge fetching: verifying
 * the difficulty and category filters are sent to the API, and that a
 * successfully fetched challenge is displayed.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Status from "./Status";

vi.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({ user: { sub: "user-123" } }),
}));

describe("Status challenge fetching", () => {
  beforeEach(() => {
    class MockAudio {
      constructor() {
        this.volume = 1;
      }
      play() {
        return Promise.resolve();
      }
    }
    global.Audio = MockAudio;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows a placeholder when it is not break time", () => {
    render(<Status isBreakTime={false} />);

    expect(screen.getByText("Not Break Time")).toBeInTheDocument();
  });

  it("requests a challenge filtered by the selected difficulty", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        title: "Do 10 jumping jacks",
        description: "Get your heart rate up",
        xp_reward: 15,
      }),
    });

    render(<Status isBreakTime={true} difficulty="Hard" />);

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    const requestedUrl = global.fetch.mock.calls[0][0];
    expect(requestedUrl).toContain("difficulty=Hard");
  });

  it("requests a challenge filtered by a selected category", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        title: "Stretch break",
        description: "Touch your toes",
        xp_reward: 5,
      }),
    });

    render(<Status isBreakTime={true} categories={["Stretch"]} />);

    await waitFor(() => expect(global.fetch).toHaveBeenCalled());

    const requestedUrl = global.fetch.mock.calls[0][0];
    expect(requestedUrl).toContain("category=Stretch");
  });

  it("displays the fetched challenge title and description", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        title: "Do 10 jumping jacks",
        description: "Get your heart rate up",
        xp_reward: 15,
      }),
    });

    render(<Status isBreakTime={true} difficulty="Easy" />);

    expect(
      await screen.findByText("Do 10 jumping jacks"),
    ).toBeInTheDocument();
    expect(screen.getByText("Get your heart rate up")).toBeInTheDocument();
  });
});