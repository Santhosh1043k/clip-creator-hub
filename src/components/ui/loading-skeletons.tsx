import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton = ({ className, style, ...props }: SkeletonProps) => (
  <div
    className={cn(
      "animate-pulse rounded-md bg-muted",
      className
    )}
    style={style}
    {...props}
  />
);

export const CardSkeleton = () => (
  <div className="rounded-xl border border-border bg-card overflow-hidden">
    <Skeleton className="aspect-video" />
    <div className="p-4 space-y-3">
      <Skeleton className="h-4 w-3/4" />
      <div className="flex gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-12 rounded-full" />
      </div>
      <div className="flex justify-between">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
    </div>
  </div>
);

export const StatCardSkeleton = () => (
  <div className="rounded-xl border border-border bg-card p-5">
    <div className="flex items-center justify-between mb-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-9 w-9 rounded-lg" />
    </div>
    <Skeleton className="h-8 w-16 mb-1" />
    <Skeleton className="h-3 w-20" />
  </div>
);

export const ChartSkeleton = () => (
  <div className="rounded-xl border border-border bg-card p-5">
    <div className="flex items-center justify-between mb-4">
      <div>
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="text-right">
        <Skeleton className="h-6 w-12 mb-1" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
    <div className="h-[180px] flex items-end gap-2 pt-4">
      {[...Array(7)].map((_, i) => (
        <Skeleton
          key={i}
          className="flex-1"
          style={{ height: `${30 + Math.random() * 70}%` }}
        />
      ))}
    </div>
  </div>
);

export const TableRowSkeleton = () => (
  <div className="flex items-center gap-4 p-4 border-b border-border">
    <Skeleton className="h-10 w-16 rounded" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-3 w-1/4" />
    </div>
    <Skeleton className="h-8 w-20 rounded" />
  </div>
);

export const VideoPlayerSkeleton = () => (
  <div className="relative aspect-video rounded-lg overflow-hidden">
    <Skeleton className="absolute inset-0" />
    <motion.div
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <Skeleton className="h-16 w-16 rounded-full" />
    </motion.div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-8">
    {/* Stats */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>

    {/* Chart */}
    <ChartSkeleton />

    {/* Projects Grid */}
    <div>
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-6 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);
