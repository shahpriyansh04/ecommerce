import { DollarSign } from "lucide-react";

import MetricCard from "./_components/MetricCard";
import TransactionTable from "./_components/TransactionTable";

export default function Dashboard() {
  return (
    <main className=" p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      {/* <h1 className="text-4xl font-semibold">Your Dashboard</h1> */}
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 pb-6 ">
        <MetricCard
          Icon={DollarSign}
          title="Total Revenue"
          value="$45,231.89"
          description="+20.1% from last month"
        />
        <MetricCard
          Icon={DollarSign}
          title="Total Revenue"
          value="$45,231.89"
          description="+20.1% from last month"
        />
        <MetricCard
          Icon={DollarSign}
          title="Total Revenue"
          value="$45,231.89"
          description="+20.1% from last month"
        />
        <MetricCard
          Icon={DollarSign}
          title="Total Revenue"
          value="$45,231.89"
          description="+20.1% from last month"
        />
      </div>
      <TransactionTable />
    </main>
  );
}
