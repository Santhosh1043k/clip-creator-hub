import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { UserStats } from "@/types/dashboard";

interface ActivityChartProps {
  weeklyActivity: UserStats["weeklyActivity"];
}

const ActivityChart = ({ weeklyActivity }: ActivityChartProps) => {
  const today = new Date().getDay();
  const dayIndex = today === 0 ? 6 : today - 1; // Adjust for Monday start

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-xl border border-border bg-card p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold">This Week's Activity</h3>
          <p className="text-sm text-muted-foreground">Clips created per day</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold">
            {weeklyActivity.reduce((sum, d) => sum + d.clips, 0)}
          </div>
          <div className="text-xs text-muted-foreground">total this week</div>
        </div>
      </div>

      <div className="h-[180px] mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-md">
                      <p className="text-sm font-medium">
                        {payload[0].payload.day}: {payload[0].value} clips
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="clips" radius={[4, 4, 0, 0]}>
              {weeklyActivity.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index === dayIndex ? "hsl(var(--primary))" : "hsl(var(--muted))"}
                  className="transition-colors"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default ActivityChart;
