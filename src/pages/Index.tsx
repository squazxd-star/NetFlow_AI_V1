import VeoflowPanel from "@/components/VeoflowPanel";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background gradient effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-red/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-red/10 rounded-full blur-3xl" />
      </div>

      {/* Main Panel */}
      <div className="relative z-10 w-full max-w-[417px]">
        <VeoflowPanel />
      </div>
    </div>
  );
};

export default Index;
