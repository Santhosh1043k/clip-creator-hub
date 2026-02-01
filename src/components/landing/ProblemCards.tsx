import { Clock, Scissors, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

const problems = [
  {
    icon: Clock,
    title: "Hours of Editing",
    description: "Manually scrubbing through hours of footage to find shareable moments is exhausting and time-consuming.",
    gradient: "from-red-500/20 to-orange-500/20",
  },
  {
    icon: Scissors,
    title: "Complex Tools",
    description: "Professional editing software has a steep learning curve. You're a creator, not a video editor.",
    gradient: "from-orange-500/20 to-yellow-500/20",
  },
  {
    icon: TrendingDown,
    title: "Missed Opportunities",
    description: "While you're editing, viral trends pass you by. Speed matters in the creator economy.",
    gradient: "from-yellow-500/20 to-green-500/20",
  },
];

const ProblemCards = () => {
  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            The Content Creator's <span className="gradient-text">Struggle</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            You create amazing long-form content, but turning it into short-form gold shouldn't feel like a second job.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="glass-card-hover rounded-2xl p-8 h-full group">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${problem.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <problem.icon className="w-7 h-7 text-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{problem.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{problem.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Solution teaser */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="inline-flex items-center gap-4 glass-card rounded-full px-6 py-3">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
            <span className="text-foreground font-medium">
              ContentRepurpose solves all of this — automatically
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProblemCards;
