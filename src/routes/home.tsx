import Balance from "@/components/balance";
import Transaction from "@/components/transaction";
import Chart from "@/components/bar-chart"; // Chart remains focused on UI
import ScrollButton from "@/components/ui/scroll-button";
import { useState } from "react";
import AddExpense from "@/components/add-expense";
import { Toaster } from "@/components/ui/toaster";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { subDays, format } from "date-fns";

interface Transaction {
  _creationTime: number;
  _id: Id<"transactions">;
  amount: number;
  category: string;
  dateTime: string;
  description: string;
  user_id: Id<"users">;
}

const getLast7Days = () => {
  return Array.from({ length: 7 }, (_, i) => subDays(new Date(), i)).reverse();
};

const getPrevious7Days = () => {
  const lastWeekStart = subDays(new Date(), 7);
  return Array.from({ length: 7 }, (_, i) => subDays(lastWeekStart, i)).reverse();
};

function Home() {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const userTransactions = useQuery(api.transactions.getUserTransactions, {}) || [];

  const last7Days = getLast7Days();
  const previous7Days = getPrevious7Days();

  const weeklyData = last7Days.map((date) => ({
    day: format(date, 'EEEE'),
    total: userTransactions
      .filter((transaction: any) => format(new Date(transaction.dateTime), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))
      .reduce((sum: number, transaction: any) => sum + transaction.amount, 0),
  }));

  const previousWeekData = previous7Days.map((date) => ({
    day: format(date, 'EEEE'),
    total: userTransactions
      .filter((transaction: any) => format(new Date(transaction.dateTime), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'))
      .reduce((sum: number, transaction: any) => sum + transaction.amount, 0),
  }));

  const totalCurrentWeek = weeklyData.reduce((sum, data) => sum + data.total, 0);
  const totalPreviousWeek = previousWeekData.reduce((sum, data) => sum + data.total, 0);
  const isFirstWeek = totalPreviousWeek === 0;
  const isSpendingUp = totalCurrentWeek > totalPreviousWeek;

  const handleAddExpenseButtonClick = () => {
    setShowAddExpense(!showAddExpense);
  };

  return (
    <div className="pb-16">
      <div className="sticky top-0 z-50 bg-background shadow-md">
        <Balance accountBalance={1000} income={500} expenses={200} currency="£" />
      </div>

      <Chart 
        weeklyData={weeklyData}
        totalCurrentWeek={totalCurrentWeek}
        totalPreviousWeek={totalPreviousWeek}
        isFirstWeek={isFirstWeek}
        isSpendingUp={isSpendingUp}
      />

      <h2 className="mt-2 text-xl font-bold p-3">Recent Transactions</h2>
      <div>
        {userTransactions.map((transaction: Transaction) => (
          <Transaction
            key={transaction._id}
            date={new Date(transaction._creationTime)}
            description={transaction.description}
            amount={transaction.amount}
            status={"completed"}
          />
        ))}
      </div>

      <div className="fixed bottom-24 right-4 z-100">
        <ScrollButton onClick={handleAddExpenseButtonClick} />
      </div>
      <AddExpense open={showAddExpense} setOpen={setShowAddExpense} />
      <Toaster className="bottom-20" />
    </div>
  );
}

export default Home;
