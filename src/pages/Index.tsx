import Header from "@/components/layout/Header";
import Hero from "@/components/landing/Hero";
import ProblemCards from "@/components/landing/ProblemCards";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <ProblemCards />
      </main>
    </div>
  );
};

export default Index;
