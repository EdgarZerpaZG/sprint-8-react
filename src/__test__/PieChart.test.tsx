import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PieChart } from "../components/chart/pieChart";

vi.mock("react-chartjs-2", () => ({
  Pie: (props: any) => (
    <div data-testid="pie-chart">
      {JSON.stringify({
        labels: props.data.labels,
        data: props.data.datasets[0].data,
        title: props.options?.plugins?.title?.text ?? "",
      })}
    </div>
  ),
}));

describe("PieChart", () => {
  it("should pass labels, data and optional title correctly to Pie chart", () => {
    const labels = ["Active", "Inactive"];
    const data = [5, 2];
    const title = "User status";

    render(<PieChart labels={labels} data={data} title={title} />);

    const el = screen.getByTestId("pie-chart");
    const parsed = JSON.parse(el.textContent || "{}");

    expect(parsed.labels).toEqual(labels);
    expect(parsed.data).toEqual(data);
    expect(parsed.title).toBe(title);
  });

  it("should work without title", () => {
    const labels = ["Active", "Inactive"];
    const data = [5, 2];

    render(<PieChart labels={labels} data={data} />);

    const el = screen.getByTestId("pie-chart");
    const parsed = JSON.parse(el.textContent || "{}");

    expect(parsed.labels).toEqual(labels);
    expect(parsed.data).toEqual(data);
    expect(parsed.title).toBe("");
  });
});