import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  X, 
  Settings, 
  RefreshCw, 
  Bell, 
  Plus, 
  Upload, 
  Trash2,
  MoreVertical,
  Heart
} from "lucide-react";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SettingsDialog = ({ open, onOpenChange }: SettingsDialogProps) => {
  const [tiktokConnected, setTiktokConnected] = useState(true);
  const [watermarkEnabled, setWatermarkEnabled] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");

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
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64c.298.008.595.058.88.15V9.4a6.33 6.33 0 00-1-.05A6.34 6.34 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
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
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64c.298.008.595.058.88.15V9.4a6.33 6.33 0 00-1-.05A6.34 6.34 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
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

          {/* Section 2: ตั้งค่า AI และ API Key */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                <Settings className="w-3 h-3 text-purple-400" />
              </div>
              <h3 className="text-sm font-semibold text-white">ตั้งค่า AI และ API Key</h3>
            </div>

            {/* API Status Items */}
            <div className="space-y-2">
              {/* Gemini API */}
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-white">Gemini API</span>
                  </div>
                  <span className="text-xs text-green-500">Connected</span>
                </div>
                <Input 
                  type="password"
                  defaultValue="••••••••••••••••"
                  className="bg-white/5 border-white/10 text-white text-sm h-8"
                />
              </div>

              {/* ElevenLabs API */}
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-white">ElevenLabs API</span>
                  </div>
                  <span className="text-xs text-green-500">Connected</span>
                </div>
                <Input 
                  type="password"
                  defaultValue="••••••••••••••••"
                  className="bg-white/5 border-white/10 text-white text-sm h-8"
                />
              </div>

              {/* Shotstack API */}
              <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    <span className="text-sm font-medium text-white">Shotstack API</span>
                  </div>
                  <span className="text-xs text-red-500">Disconnected</span>
                </div>
                <Input 
                  placeholder="ใส่ API Key..."
                  className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground/50 text-sm h-8"
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
            <Button variant="outline" className="w-full bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:text-white text-sm">
              <Upload className="w-4 h-4 mr-2" />
              อัปโหลดโลโก้ส่วนตัว
            </Button>
          </div>

          {/* Section 4: ภาษาเริ่มต้น */}
          <div className="space-y-3">
            <span className="text-xs text-muted-foreground">ภาษาเริ่มต้น</span>
            <div className="grid grid-cols-2 gap-2">
              <Select defaultValue="th">
                <SelectTrigger className="bg-white/5 border-white/10 text-white text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10">
                  <SelectItem value="th">ไทย</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="th">
                <SelectTrigger className="bg-white/5 border-white/10 text-white text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#1a1a1a] border-white/10">
                  <SelectItem value="th">ไทย</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="zh">中文</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Section 5: ตรวจสอบสถานะระบบ */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-pink-500/20 flex items-center justify-center">
                <Heart className="w-3 h-3 text-pink-400" />
              </div>
              <h3 className="text-sm font-semibold text-white">ตรวจสอบสถานะระบบ</h3>
            </div>

            <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-4">
              {/* Main Server */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <span className="text-muted-foreground">Main Server</span>
                  </div>
                  <span className="text-green-500 font-medium">98%</span>
                </div>
                <Progress value={98} className="h-2 bg-white/10 [&>div]:bg-gradient-to-r [&>div]:from-green-500 [&>div]:to-green-400" />
              </div>

              {/* AI Engine */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span className="text-muted-foreground">AI Engine</span>
                  </div>
                  <span className="text-green-500 font-medium">100%</span>
                </div>
                <Progress value={100} className="h-2 bg-white/10 [&>div]:bg-gradient-to-r [&>div]:from-green-500 [&>div]:to-green-400" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <Button variant="outline" className="w-full bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:text-white text-sm">
                <Trash2 className="w-4 h-4 mr-2" />
                ล้างแคชและข้อมูลชั่วคราว
              </Button>
              <Button variant="outline" className="w-full bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:text-white text-sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                กู้คืนการตั้งค่าเริ่มต้น
              </Button>
            </div>
          </div>

          {/* Save Button */}
          <Button className="w-full bg-neon-red hover:bg-neon-red/90 text-white font-semibold py-6 text-base">
            <Settings className="w-5 h-5 mr-2" />
            บันทึกการตั้งค่าทั้งหมด
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
