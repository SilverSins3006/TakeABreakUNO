import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Timer from "./Timer";

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
