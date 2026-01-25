import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { saveApiKey, getApiKey, clearApiKey } from "../services/storageService";
import { Key, Save, Trash2, CheckCircle2 } from "lucide-react";

export function SettingsTab() {
    const [apiKey, setApiKey] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        const key = await getApiKey();
        if (key) setApiKey(key);
    };

    const handleSave = async () => {
        if (!apiKey.trim()) {
            toast({
                title: "Error",
                description: "Please enter a valid API Key",
                variant: "destructive"
            });
            return;
        }

        setIsLoading(true);
        try {
            await saveApiKey(apiKey.trim());
            toast({
                title: "Settings Saved",
                description: "Your API Key is saved locally.",
                variant: "default",
                className: "bg-green-600 text-white"
            });
        } catch (error) {
            toast({
                title: "Save Failed",
                description: "Could not save settings.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = async () => {
        await clearApiKey();
        setApiKey("");
        toast({
            title: "Cleared",
            description: "API Key removed from storage.",
        });
    };

    return (
        <div className="space-y-6 pt-4">
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                    <Key className="w-5 h-5 text-yellow-500" />
                    <h3 className="text-lg font-semibold text-white">Google Gemini / Ultra Settings</h3>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="apiKey" className="text-slate-300">Google AI Studio API Key</Label>
                    <Input
                        id="apiKey"
                        type="password"
                        placeholder="AIzaSy..."
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="bg-slate-950 border-slate-700 text-white"
                    />
                    <p className="text-xs text-slate-500">
                        Required for Real Mode (Ultra/Veo). Get one at <a href="https://aistudio.google.com/" target="_blank" className="text-blue-400 hover:underline">aistudio.google.com</a>.
                        Must be a Pay-as-you-go key for Veo.
                    </p>
                </div>

                <div className="flex gap-3 pt-2">
                    <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                        {isLoading ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Settings</>}
                    </Button>

                    <Button
                        variant="outline"
                        onClick={handleClear}
                        className="border-red-900/50 text-red-500 hover:bg-red-950/50 hover:text-red-400"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="bg-yellow-900/20 p-4 rounded-lg border border-yellow-900/50">
                <h4 className="text-sm font-semibold text-yellow-500 mb-1">BYOK Mode (Bring Your Own Key)</h4>
                <p className="text-xs text-yellow-200/70">
                    Your key is stored locally in your browser/extension storage. NetFlow AI does not collect or store your keys on any server.
                </p>
            </div>
        </div>
    );
}
