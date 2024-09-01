import Balance from "@/components/balance";
import Transaction from "@/components/transaction";
import Chart from "@/components/bar-chart";
import { useNavigate } from "react-router-dom";
import ScrollButton from "@/components/ui/scroll-button";

function Home() {
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

  const navigate = useNavigate();

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
        {MOCK_TRANSACTIONS.map((transaction) => (
          <Transaction
            key={transaction.id}
            date={new Date(transaction.date)}
            description={transaction.description}
            amount={transaction.amount}
            status={transaction.status}
          />
        ))}
      </div>
      <br></br>
      <div className="fixed bottom-24 right-4 z-100">
        <ScrollButton /> {/* Use the ScrollButton component here */}
      </div>
    </div>
  );
}

export default Home;
