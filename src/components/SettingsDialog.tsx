import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
    X,
    Settings,
    RefreshCw,
    Bell,
    Plus,
    MoreVertical,
    Heart,
    CheckCircle2,
    AlertCircle,
    Loader2
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { saveApiKey, getApiKey } from "../services/storageService";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface SettingsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
    const [tiktokConnected, setTiktokConnected] = useState(true);
    const [watermarkEnabled, setWatermarkEnabled] = useState(false);
    const [webhookUrl, setWebhookUrl] = useState("");
    const [apiKey, setApiKey] = useState("");
    const [openaiKey, setOpenaiKey] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isTesting, setIsTesting] = useState(false);
    const [isTestingOpenAI, setIsTestingOpenAI] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (open) {
            loadSettings();
        }
    }, [open]);

    const loadSettings = async () => {
        const key = await getApiKey('gemini');
        if (key) setApiKey(key);

        const openAi = await getApiKey('openai');
        if (openAi) setOpenaiKey(openAi);
    };

    const handleTestConnection = async () => {
        if (!apiKey.trim()) {
            toast({ title: "Error", description: "Please enter an API Key first", variant: "destructive" });
            return;
        }

        setIsTesting(true);
        try {
            // Test connection by listing models or simple generation
            const genAI = new GoogleGenerativeAI(apiKey.trim());
            // Use gemini-2.0-flash as it is the standard for new keys
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

            // Simple ping
            await model.generateContent("Test");

            toast({
                title: "Gemini Connection Successful! 🎉",
                description: "Your Google API Key is valid.",
                variant: "default",
                className: "bg-green-600 text-white"
            });
        } catch (error: any) {
            let msg = error.message || "Unknown error";
            if (msg.includes("403")) msg = "Key Invalid or Leaked (403)";
            if (msg.includes("429")) msg = "Quota Exceeded (429)";

            toast({
                title: "Gemini Connection Failed ❌",
                description: msg,
                variant: "destructive"
            });
        } finally {
            setIsTesting(false);
        }
    };

    const handleTestOpenAI = async () => {
        if (!openaiKey.trim()) {
            toast({ title: "Error", description: "Please enter an OpenAI Key first", variant: "destructive" });
            return;
        }

        setIsTestingOpenAI(true);
        try {
            const response = await fetch("https://api.openai.com/v1/models", {
                headers: {
                    "Authorization": `Bearer ${openaiKey.trim()}`
                }
            });

            if (response.ok) {
                toast({
                    title: "OpenAI Connection Successful! 🎉",
                    description: "Your OpenAI Key is valid.",
                    variant: "default",
                    className: "bg-green-600 text-white"
                });
            } else {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error: any) {
            toast({
                title: "OpenAI Connection Failed ❌",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setIsTestingOpenAI(false);
        }
    };

    const handleSaveAll = async () => {
        setIsLoading(true);
        try {
            if (apiKey.trim()) {
                await saveApiKey(apiKey.trim(), 'gemini');
            }
            if (openaiKey.trim()) {
                await saveApiKey(openaiKey.trim(), 'openai');
            }

            toast({
                title: "บันทึกการตั้งค่าสำเร็จ",
                description: "ข้อมูล API Key และการตั้งค่าอื่นๆ ถูกบันทึกแล้ว",
                variant: "default",
                className: "bg-green-600 text-white"
            });
            onOpenChange(false);
        } catch (error) {
            toast({
                title: "เกิดข้อผิดพลาด",
                description: "ไม่สามารถบันทึกข้อมูลได้",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md bg-[#0a0a0a] border border-white/10 text-white p-0 gap-0 max-h-[90vh] overflow-y-auto rounded-2xl">
                {/* Header */}
                <DialogHeader className="p-4 pb-2 sticky top-0 bg-[#0a0a0a] z-10 border-b border-white/5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-neon-red/20 flex items-center justify-center">
                                <Settings className="w-4 h-4 text-neon-red" />
                            </div>
                            <div>
                                <DialogTitle className="text-lg font-bold text-white">การตั้งค่าระบบ</DialogTitle>
                                <p className="text-xs text-muted-foreground">จัดการบัญชี, การเชื่อมต่อ API และประสิทธิภาพการผลิต</p>
                            </div>
                        </div>
                        <button
                            onClick={() => onOpenChange(false)}
                            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                        >
                            <X className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>
                </DialogHeader>

                <div className="p-4 space-y-6">
                    {/* Section 1: การเชื่อมต่อและซิงค์ข้อมูล */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <RefreshCw className="w-3 h-3 text-blue-400" />
                            </div>
                            <h3 className="text-sm font-semibold text-white">การเชื่อมต่อและซิงค์ข้อมูล</h3>
                        </div>

                        {/* TikTok Studio */}
                        <div className="bg-white/5 rounded-xl p-4 space-y-3 border border-white/10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center">
                                        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
                                            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64c.298.008.595.058.88.15V9.4a6.33 6.33 0 00-1-.05A6.34 6.34 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-white">TikTok Studio</span>
                                        <p className="text-xs text-muted-foreground">ซิงค์ Product ID อัตโนมัติ</p>
                                    </div>
                                </div>
                                <Switch
                                    checked={tiktokConnected}
                                    onCheckedChange={setTiktokConnected}
                                    className="data-[state=checked]:bg-neon-red"
                                />
                            </div>
                            <Button className="w-full bg-neon-red hover:bg-neon-red/90 text-white text-sm font-medium">
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Force Sync ข้อมูลล่าสุด
                            </Button>
                        </div>

                        {/* บัญชีที่เชื่อมต่อ */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <svg viewBox="0 0 24 24" className="w-4 h-4 text-muted-foreground" fill="currentColor">
                                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64c.298.008.595.058.88.15V9.4a6.33 6.33 0 00-1-.05A6.34 6.34 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                                </svg>
                                <span className="text-xs text-muted-foreground">บัญชีที่เชื่อมต่อ</span>
                            </div>

                            {/* Connected Account */}
                            <div className="bg-white/5 rounded-xl p-3 border border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                                        S
                                    </div>
                                    <div>
                                        <span className="text-sm font-medium text-white">@shopowner_th</span>
                                        <p className="text-xs text-muted-foreground">Proxy: TH-Bangkok-01</p>
                                    </div>
                                </div>
                                <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                                    <MoreVertical className="w-4 h-4 text-muted-foreground" />
                                </button>
                            </div>

                            {/* Add New Account */}
                            <button className="w-full bg-white/5 hover:bg-white/10 rounded-xl p-3 border border-white/10 border-dashed flex items-center justify-center gap-2 transition-colors">
                                <Plus className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">เพิ่มบัญชีใหม่</span>
                            </button>
                        </div>

                        {/* Webhooks */}
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Bell className="w-4 h-4 text-neon-red" />
                                <span className="text-xs text-muted-foreground">Webhooks แจ้งเตือน</span>
                            </div>
                            <Input
                                value={webhookUrl}
                                onChange={(e) => setWebhookUrl(e.target.value)}
                                placeholder="https://..."
                                className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 text-sm"
                            />
                            <p className="text-[10px] text-muted-foreground">
                                * แจ้งเตือนไปยัง Line/Discord เมื่อเรนเดอร์งานเสร็จ
                            </p>
                        </div>
                    </div>

                    {/* Section 5: Developer Options */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                <div className="w-3 h-3 text-yellow-500 font-bold">D</div>
                            </div>
                            <h3 className="text-sm font-semibold text-white">Developer Mode</h3>
                        </div>

                        <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-3">
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-sm font-medium text-white">Simulation Mode (ระบบจำลอง)</span>
                                    <p className="text-xs text-muted-foreground">ใช้ Mock Data แสดงผลแทนการยิง API จริง (เหมาะสำหรับ Demo)</p>
                                </div>
                                <Switch
                                    id="simulation-mode"
                                    // Logic to be connected to storage later, for now we just show UI
                                    defaultChecked={localStorage.getItem("netflow_simulation_mode") === "true"}
                                    onCheckedChange={(checked) => {
                                        localStorage.setItem("netflow_simulation_mode", checked.toString());
                                        toast({
                                            title: checked ? "Enabled Simulation Mode" : "Disabled Simulation Mode",
                                            description: "Reloading page to apply changes...",
                                        });
                                        setTimeout(() => window.location.reload(), 1000);
                                    }}
                                    className="data-[state=checked]:bg-yellow-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: ตั้งค่า AI และ API Key */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                                <Settings className="w-3 h-3 text-purple-400" />
                            </div>
                            <h3 className="text-sm font-semibold text-white">ตั้งค่า AI และ API Key (BYOK)</h3>
                        </div>

                        {/* API Status Items */}
                        <div className="space-y-2">
                            {/* Gemini API */}
                            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${apiKey ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        <span className="text-sm font-medium text-white">Gemini API (Google Ultra/Veo)</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleTestConnection}
                                        disabled={isTesting || !apiKey}
                                        className={`h-6 text-[10px] px-2 ${apiKey ? 'text-blue-400 hover:text-blue-300' : 'text-gray-500'}`}
                                    >
                                        {isTesting ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <CheckCircle2 className="w-3 h-3 mr-1" />}
                                        Test Connection
                                    </Button>
                                </div>
                                <Input
                                    type="password"
                                    placeholder="Paste your AIza... Key Here"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    className="bg-white/5 border-white/10 text-white text-sm h-8"
                                />
                                <p className="text-[10px] text-muted-foreground mt-1">
                                    * จำเป็นสำหรับ Real Mode (Ultra/Veo). สมัครฟรีที่ <a href="https://aistudio.google.com/" target="_blank" className="underline text-blue-400">aistudio.google.com</a>
                                </p>
                            </div>

                            {/* ElevenLabs API (Replaced with OpenAI for now as requested) */}
                            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${openaiKey ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                                        <span className="text-sm font-medium text-white">OpenAI API (GPT-4)</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleTestOpenAI}
                                        disabled={isTestingOpenAI || !openaiKey}
                                        className={`h-6 text-[10px] px-2 ${openaiKey ? 'text-blue-400 hover:text-blue-300' : 'text-gray-500'}`}
                                    >
                                        {isTestingOpenAI ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : <CheckCircle2 className="w-3 h-3 mr-1" />}
                                        Test Connection
                                    </Button>
                                </div>
                                <Input
                                    type="password"
                                    placeholder="sk-..."
                                    value={openaiKey}
                                    onChange={(e) => setOpenaiKey(e.target.value)}
                                    className="bg-white/5 border-white/10 text-white text-sm h-8"
                                />
                            </div>
                            {/* ElevenLabs API (Placeholder) */}
                            <div className="bg-white/5 rounded-xl p-3 border border-white/10 opacity-50 pointer-events-none">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                                        <span className="text-sm font-medium text-white">ElevenLabs API (Coming Soon)</span>
                                    </div>
                                </div>
                                <Input
                                    disabled
                                    placeholder="Coming Soon..."
                                    className="bg-white/5 border-white/10 text-white text-sm h-8"
                                />
                            </div>

                        </div>
                    </div>

                    {/* Section 3: Watermark */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-neon-red"></div>
                                <span className="text-sm font-medium text-white">ลายน้ำ (Watermark)</span>
                            </div>
                            <Switch
                                checked={watermarkEnabled}
                                onCheckedChange={setWatermarkEnabled}
                                className="data-[state=checked]:bg-neon-red"
                            />
                        </div>
                    </div>

                    {/* Save Button */}
                    <Button
                        onClick={handleSaveAll}
                        disabled={isLoading}
                        className="w-full bg-neon-red hover:bg-neon-red/90 text-white font-semibold py-6 text-base"
                    >
                        {isLoading ? "Saving..." : (
                            <>
                                <Settings className="w-5 h-5 mr-2" />
                                บันทึกการตั้งค่าทั้งหมด
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SettingsDialog;
