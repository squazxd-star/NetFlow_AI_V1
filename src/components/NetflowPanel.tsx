import { useState } from "react";
import { Zap, Settings, RefreshCw, Wand2, Radio, ShoppingBag } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SettingsDialog from "@/components/SettingsDialog";
import ErrorBoundary from "@/components/ErrorBoundary";
import CreateVideoTab from "@/components/dashboard/CreateVideoTab";
import NetCastTab from "@/components/dashboard/NetCastTab";
import TikTokSettingsTab from "@/components/dashboard/TikTokSettingsTab";


const NetflowPanel = () => {
    // Tab state for smooth transitions
    const [activeTab, setActiveTab] = useState("create");

    // Settings Dialog state
    const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);

    return (
        <div className="min-h-screen w-full max-w-[417px] mx-auto bg-background overflow-y-auto">
            {/* Header */}
            <header className="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
                <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-neon-red" />
                    <h1 className="text-lg font-bold text-foreground">
                        <span className="text-neon-red">NETFLOW</span> AI
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <span className="w-2 h-2 rounded-full bg-green-500 status-dot"></span>
                        <span>ระบบพร้อมทำงาน</span>
                    </div>
                    <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                        <RefreshCw className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <button
                        onClick={() => setSettingsDialogOpen(true)}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                    >
                        <Settings className="w-4 h-4 text-muted-foreground" />
                    </button>

                    {/* Settings Dialog */}
                    <SettingsDialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen} />
                </div>
            </header>

            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full h-auto p-0 bg-transparent rounded-none border-b border-border">
                    <TabsTrigger
                        value="create"
                        className="flex-1 py-3 px-2 rounded-none border-b-2 border-transparent data-[state=active]:border-neon-red data-[state=active]:bg-transparent data-[state=active]:text-neon-red data-[state=active]:shadow-none text-muted-foreground text-xs font-medium transition-all duration-200"
                    >
                        <Wand2 className="w-3 h-3 mr-1.5" />
                        สร้างวิดีโอ
                    </TabsTrigger>
                    <TabsTrigger
                        value="netcast"
                        className="flex-1 py-3 px-2 rounded-none border-b-2 border-transparent data-[state=active]:border-neon-red data-[state=active]:bg-transparent data-[state=active]:text-neon-red data-[state=active]:shadow-none text-muted-foreground text-xs font-medium transition-all duration-200"
                    >
                        <Radio className="w-3 h-3 mr-1.5" />
                        NetCast Pro
                    </TabsTrigger>
                    <TabsTrigger
                        value="tiktok"
                        className="flex-1 py-3 px-2 rounded-none border-b-2 border-transparent data-[state=active]:border-neon-red data-[state=active]:bg-transparent data-[state=active]:text-neon-red data-[state=active]:shadow-none text-muted-foreground text-xs font-medium transition-all duration-200"
                    >
                        <ShoppingBag className="w-3 h-3 mr-1.5" />
                        ตั้งค่า TikTok
                    </TabsTrigger>
                </TabsList>

                {/* Create Video Tab */}
                <TabsContent value="create" className="mt-0 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-left-2 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 duration-200">
                    <ErrorBoundary>
                        <CreateVideoTab />
                    </ErrorBoundary>
                </TabsContent>

                {/* NetCast Pro Tab */}
                <TabsContent value="netcast" className="mt-0 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-right-2 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 duration-200">
                    <ErrorBoundary>
                        <NetCastTab />
                    </ErrorBoundary>
                </TabsContent>

                {/* TikTok Settings Tab */}
                <TabsContent value="tiktok" className="mt-0 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-right-2 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 duration-200">
                    <ErrorBoundary>
                        <TikTokSettingsTab />
                    </ErrorBoundary>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default NetflowPanel;
