import Header from "@/components/layout/Header";
import { motion } from "framer-motion";
import { FolderOpen } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Your <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Manage your uploaded videos and generated clips.
            </p>
          </motion.div>

          {/* Empty state */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-16 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted flex items-center justify-center">
              <FolderOpen className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No videos yet</h3>
            <p className="text-muted-foreground">
              Upload your first video to start creating viral shorts.
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
