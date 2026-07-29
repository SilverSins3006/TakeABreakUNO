/**
 * @file Tests for the Dashboard page's timer controls: starting,
 * pausing, resetting, and the automatic "Restart" state once a session
 * reaches zero.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Dashboard from "./Dashboard";

vi.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({ logout: vi.fn() }),
}));

// Status makes its own network/auth calls and isn't the target of this
// test, so it's stubbed out to keep these tests focused on the timer.
vi.mock("../components/Status", () => ({
  default: () => <div data-testid="status-stub" />,
}));

describe("Dashboard timer controls", () => {
  it("shows Start and begins running when the timer is idle", () => {
    const setIsRunning = vi.fn();

    render(
      <Dashboard
        seconds={1500}
        isRunning={false}
        setIsRunning={setIsRunning}
        setSeconds={vi.fn()}
        sessionLength={1500}
        onOpenSettings={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Start" }));

    expect(setIsRunning).toHaveBeenCalledWith(true);
  });

  it("shows Pause and stops the timer when it is running", () => {
    const setIsRunning = vi.fn();

    render(
      <Dashboard
        seconds={1500}
        isRunning={true}
        setIsRunning={setIsRunning}
        setSeconds={vi.fn()}
        sessionLength={1500}
        onOpenSettings={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Pause" }));

    expect(setIsRunning).toHaveBeenCalledWith(false);
  });

  it("shows Restart once the timer hits zero, and restarts at the full session length", () => {
    const setIsRunning = vi.fn();
    const setSeconds = vi.fn();

    render(
      <Dashboard
        seconds={0}
        isRunning={false}
        setIsRunning={setIsRunning}
        setSeconds={setSeconds}
        sessionLength={1500}
        onOpenSettings={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Restart" }));

    expect(setSeconds).toHaveBeenCalledWith(1500);
    expect(setIsRunning).toHaveBeenCalledWith(true);
  });

  it("resets the timer back to the session length on Reset", () => {
    const setIsRunning = vi.fn();
    const setSeconds = vi.fn();

    render(
      <Dashboard
        seconds={900}
        isRunning={true}
        setIsRunning={setIsRunning}
        setSeconds={setSeconds}
        sessionLength={1500}
        onOpenSettings={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));

    expect(setSeconds).toHaveBeenCalledWith(1500);
    expect(setIsRunning).toHaveBeenCalledWith(false);
  });
});