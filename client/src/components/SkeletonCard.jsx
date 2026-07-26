export default function SkeletonCard() {
  return (
    <div className="glass-card flex flex-col gap-3 p-5">
      <div className="skeleton h-10 w-10 rounded-xl" />
      <div className="space-y-2">
        <div className="skeleton h-3.5 w-2/3 rounded" />
        <div className="skeleton h-3 w-full rounded" />
      </div>
    </div>
  );
}
