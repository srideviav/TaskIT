export default function StatCard({ title, value }: any) {
  return (
    <div className="bg-white shadow rounded p-4 w-60">
      <p className="text-gray-500">{title}</p>
      <h3 className="text-xl font-bold">{value}</h3>
    </div>
  );
}