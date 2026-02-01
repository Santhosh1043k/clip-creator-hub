import { motion } from "framer-motion";
import { Video, Scissors, Clock, TrendingUp } from "lucide-react";
import { UserStats } from "@/types/dashboard";

interface StatsCardsProps {
  stats: UserStats;
}

const StatsCards = ({ stats }: StatsCardsProps) => {
  const cards = [
    {
      label: "Videos Processed",
      value: stats.totalVideosProcessed,
      icon: Video,
      color: "from-primary to-primary/60",
      change: "+3 this week",
    },
    {
      label: "Clips Created",
      value: stats.clipsCreated,
      icon: Scissors,
      color: "from-secondary to-secondary/60",
      change: "+12 this week",
    },
    {
      label: "Hours Saved",
      value: stats.hoursSaved.toFixed(1),
      icon: Clock,
      color: "from-accent to-accent/60",
      change: "~15 min per clip",
    },
    {
      label: "Efficiency",
      value: stats.totalVideosProcessed > 0 
        ? `${Math.round((stats.clipsCreated / stats.totalVideosProcessed) * 100)}%`
        : "—",
      icon: TrendingUp,
      color: "from-primary to-secondary",
      change: "clip extraction rate",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative overflow-hidden rounded-xl border border-border bg-card p-5 hover:border-primary/50 transition-colors"
        >
          {/* Background gradient */}
          <div
            className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.color} opacity-10 blur-2xl`}
          />

          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground">{card.label}</span>
              <div className={`p-2 rounded-lg bg-gradient-to-br ${card.color}`}>
                <card.icon className="w-4 h-4 text-primary-foreground" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{card.value}</div>
            <div className="text-xs text-muted-foreground">{card.change}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default StatsCards;
