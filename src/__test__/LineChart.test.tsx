import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import LineChart from "../components/chart/lineChart";

vi.mock("react-chartjs-2", () => ({
  Bar: (props: any) => (
    <div data-testid="bar-chart">
      {JSON.stringify({
        labels: props.data.labels,
        data: props.data.datasets[0].data,
        title: props.options.plugins.title.text,
      })}
    </div>
  ),
}));

describe("LineChart", () => {
  it("should pass labels, data and title correctly to Bar chart", () => {
    const labels = ["Jan", "Feb", "Mar"];
    const data = [10, 20, 30];
    const title = "Users per month";

    render(<LineChart labels={labels} data={data} title={title} />);

    const el = screen.getByTestId("bar-chart");
    const parsed = JSON.parse(el.textContent || "{}");

    expect(parsed.labels).toEqual(labels);
    expect(parsed.data).toEqual(data);
    expect(parsed.title).toBe(title);
  });
});