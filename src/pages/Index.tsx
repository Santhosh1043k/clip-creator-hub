import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/landing/Hero";
import ProblemCards from "@/components/landing/ProblemCards";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <ProblemCards />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
