import LineChart from "../components/chart/lineChart";
import BarChart from "../components/chart/barChart";
import { PieChart } from "../components/chart/pieChart";

export default function Chart() {
    return (
        <>
            <main className="h-full">
                <section className="w-full my-5">
                    <h2 className="text-center text-2xl font-bold mb-4">Line Chart</h2>
                    <LineChart />
                </section>
                <section className="w-full my-5">
                    <h2 className="text-center text-2xl font-bold mb-4">Bar Chart</h2>
                    <BarChart />
                </section>
                <section className="w-full my-5">
                    <h2 className="text-center text-2xl font-bold mb-4">Pie Chart</h2>
                    <PieChart />
                </section>
            </main>
        </>
    )
}