import Balance from "@/components/balance";
import Transaction from "@/components/transaction";
import Chart from "@/components/bar-chart";
import ScrollButton from "@/components/ui/scroll-button";
import { useState } from "react";
import AddExpense from "@/components/add-expense";
import { Toaster } from "@/components/ui/toaster";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "convex/_generated/dataModel";

interface Transaction {
  _creationTime: number;
  _id: Id<"transactions">;
  amount: number;
  category: string;
  dateTime: string;
  description: string;
  user_id: Id<"users">;
}

function Home() {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const userTransactions = useQuery(api.transactions.getUserTransactions, {}) || [];
  console.log(userTransactions);

  const handleAddExpenseButtonClick = () => {
    console.log("Add Expense Button Clicked");
    setShowAddExpense(!showAddExpense);
  };

  const MOCK_TRANSACTIONS = [
    {
      id: 1,
      date: "2024-09-01",
      description: "Payment from John Doe",
      amount: 100,
      status: "completed",
    },
    {
      id: 2,
      date: "2024-09-02",
      description: "Payment from Jane Doe",
      amount: 200,
      status: "completed",
    },
    {
      id: 3,
      date: "2024-09-03",
      description: "Payment from John Doe",
      amount: 300,
      status: "failed",
    },
    {
      id: 4,
      date: "2024-09-04",
      description: "Payment from Jane Doe",
      amount: 400,
      status: "pending",
    },
    {
      id: 5,
      date: "2024-09-05",
      description: "Payment from John Doe",
      amount: 500,
      status: "completed",
    },
  ];

  return (
    <div className="pb-16">
      {/* Sticky Balance Component */}
      <div className="sticky top-0 z-50 bg-background shadow-md">
        <Balance
          accountBalance={1000}
          income={500}
          expenses={200}
          currency="£"
        />
      </div>

      <Chart />
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
      <br></br>
      <div className="fixed bottom-24 right-4 z-100">
        <ScrollButton onClick={() => handleAddExpenseButtonClick()} />{" "}
        {/* Use the ScrollButton component here */}
      </div>
      <AddExpense open={showAddExpense} setOpen={setShowAddExpense} />
      <Toaster className="bottom-20" />
    </div>
  );
}

export default Home;
