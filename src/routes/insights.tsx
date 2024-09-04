import { Donut } from '@/components/pie-chart'

const Insights = () => {
  return (
    <div className="p-1">
      <div
        className="text-white p-14 bg-background rounded-lg shadow-md"
        style={{
          backgroundImage: "url('/stacked-waves.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}>
        <div>
          <div className="items-center text-center">
            <p className="text-2xl font-semibold">Category Summary</p>
            <p className="text-lg font-bold text-gray-400">
              January - September 2024
            </p>
          </div>
        </div>
      </div>
      <div className='p-2 pt-4'>
        <Donut />
      </div>
    </div>
  );
};

export default Insights;
