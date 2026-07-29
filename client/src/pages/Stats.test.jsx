/**
 * @file Tests for the Stats page's exception handling around a failed
 * database/API request: a non-OK response, a thrown network error, and
 * the success path for comparison.
 */

import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Stats from "./Stats";

vi.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({ user: { sub: "user-123" } }),
}));

function renderStats() {
  return render(
    <MemoryRouter>
      <Stats />
    </MemoryRouter>,
  );
}

describe("Stats error handling", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows an error message when the stats request comes back not-ok", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });

    renderStats();

    expect(
      await screen.findByText("Unable to load your stats."),
    ).toBeInTheDocument();
  });

  it("shows an error message when the network request throws", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network down"));

    renderStats();

    expect(await screen.findByText("Network down")).toBeInTheDocument();
  });

  it("renders stats once the request succeeds", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ user: { xp: 250, challenges_completed: 4 } }),
    });

    renderStats();

    expect(await screen.findByText("250")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });
});