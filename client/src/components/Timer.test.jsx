import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Timer from "./Timer";
import { getRemainingSeconds } from "../utils/timer";
import { afterEach, vi } from "vitest";

describe("Timer", () => {
  it("displays zero seconds as 0:00", () => {
    render(<Timer seconds={0} />);

    expect(screen.getByText("0:00")).toBeInTheDocument();
  });

  it("adds a leading zero when fewer than 10 seconds remain", () => {
    render(<Timer seconds={9} />);

    expect(screen.getByText("0:09")).toBeInTheDocument();
  });

  it("formats minutes and seconds correctly", () => {
    render(<Timer seconds={90} />);

    expect(screen.getByText("1:30")).toBeInTheDocument();
  });

  it("displays an exact minute with two zeroes", () => {
    render(<Timer seconds={60} />);

    expect(screen.getByText("1:00")).toBeInTheDocument();
  });

  it("formats multiple minutes correctly", () => {
    render(<Timer seconds={605} />);

    expect(screen.getByText("10:05")).toBeInTheDocument();
  });

  it("formats hours, minutes, and seconds correctly", () => {
    render(<Timer seconds={3661} />);

    expect(screen.getByText("1:01:01")).toBeInTheDocument();
  });
});

describe("Timer countdown behavior", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("counts down correctly", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-28T12:00:00.000Z"));

    const endTime = Date.now() + 5000;

    expect(getRemainingSeconds(endTime)).toBe(5);

    vi.advanceTimersByTime(1000);
    expect(getRemainingSeconds(endTime)).toBe(4);

    vi.advanceTimersByTime(4000);
    expect(getRemainingSeconds(endTime)).toBe(0);
  });

  it("does not go below zero", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-28T12:00:00.000Z"));

    const endTime = Date.now() + 5000;

    vi.advanceTimersByTime(7000);

    expect(getRemainingSeconds(endTime)).toBe(0);
  });
});
