import { useState } from "react";
import { 
  Plus, Terminal, Zap, Wand2, User, Settings, Play, Infinity, 
  ShoppingBag, Eye, ChevronDown, Youtube, FileText, Sparkles, 
  Image, Video, Clock, RefreshCw, Check, Palette, BarChart3, 
  Pencil, Stars, Link, Radio, Tv, Mic, Globe, Save
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SettingsDialog from "@/components/SettingsDialog";

type ClipCountOption = 5 | 10 | 25 | 50 | 100 | "unlimited";
type AspectRatioOption = "9:16" | "16:9";
type RestIntervalOption = "30s" | "1m" | "2m" | "5m" | "10m";
type VideoDurationOption = "short" | "medium" | "long";
type GenderOption = "male" | "female";
type SaleStyleOption = "hard" | "soft" | "educational" | "storytelling";
type LanguageOption = "th-central" | "th-north" | "th-south" | "th-isan";
type TemplateOption = "product-review" | "brainrot-product" | "unboxing" | "comparison" | "testimonial" | "flash-sale";
type VoiceToneOption = "energetic" | "calm" | "friendly" | "professional";
type EmotionSyncOption = "natural" | "lively" | "calm";
type AgeRangeOption = "teen" | "young-adult" | "adult" | "middle-age" | "senior";
type PersonalityOption = "cheerful" | "calm" | "professional" | "playful" | "mysterious";
type ClothingStyleOption = "casual" | "formal" | "sporty" | "fashion" | "uniform";
type BackgroundOption = "studio" | "outdoor" | "home" | "office" | "abstract";
type VoiceSettingOption = "original" | "ai-generated" | "text-to-speech";
type ExpressionOption = "neutral" | "happy" | "excited" | "serious";
type CameraAngleOption = "front" | "side" | "close-up" | "full-body" | "dynamic";
type MovementOption = "static" | "minimal" | "active";

const VeoflowPanel = () => {
  // Tab state for smooth transitions
  const [activeTab, setActiveTab] = useState("create");
  
  // Settings Dialog state
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false);
  
  // Product Data (TikTok Tab)
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [characterImages, setCharacterImages] = useState<(string | null)[]>([null, null]);
  
  // AI Scripting
  const [useAiScript, setUseAiScript] = useState(true);
  const [productReviewMode, setProductReviewMode] = useState(true);
  const [aiPrompt, setAiPrompt] = useState("");
  const [saleStyle, setSaleStyle] = useState<SaleStyleOption>("hard");
  const [language, setLanguage] = useState<LanguageOption>("th-central");
  const [voiceTone, setVoiceTone] = useState<VoiceToneOption>("energetic");
  const [template, setTemplate] = useState<TemplateOption>("product-review");
  const [hookText, setHookText] = useState("");
  const [ctaText, setCtaText] = useState("");
  const [hookEnabled, setHookEnabled] = useState(true);
  const [ctaEnabled, setCtaEnabled] = useState(true);
  
  // AI Character & Style
  const [gender, setGender] = useState<GenderOption>("female");
  const [emotionSync, setEmotionSync] = useState<EmotionSyncOption>("natural");
  const [cryptoLiveData, setCryptoLiveData] = useState(false);
  const [ageRange, setAgeRange] = useState<AgeRangeOption>("teen");
  const [personality, setPersonality] = useState<PersonalityOption>("cheerful");
  const [clothingStyles, setClothingStyles] = useState<ClothingStyleOption[]>(["casual"]);
  const [background, setBackground] = useState<BackgroundOption>("studio");
  const [voiceSetting, setVoiceSetting] = useState<VoiceSettingOption>("original");
  const [touchLevel, setTouchLevel] = useState<"low" | "medium" | "high">("medium");
  const [expression, setExpression] = useState<ExpressionOption>("neutral");
  const [cameraAngles, setCameraAngles] = useState<CameraAngleOption[]>(["front"]);
  const [movement, setMovement] = useState<MovementOption>("minimal");
  
  // Generation Settings
  const [clipCount, setClipCount] = useState<ClipCountOption>(50);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>("9:16");
  const [videoDuration, setVideoDuration] = useState<VideoDurationOption>("short");
  const [restInterval, setRestInterval] = useState<RestIntervalOption>("30s");
  
  // Posting Settings
  const [autoPostTikTok, setAutoPostTikTok] = useState(true);
  const [autoPostYoutube, setAutoPostYoutube] = useState(false);
  const [smartLoop, setSmartLoop] = useState(false);

  // Section open states
  const [aiScriptOpen, setAiScriptOpen] = useState(true);
  const [characterOpen, setCharacterOpen] = useState(true);
  const [qualityOpen, setQualityOpen] = useState(true);
  const [productionOpen, setProductionOpen] = useState(true);
  const [productDataOpen, setProductDataOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(true);
  
  // TikTok Tab - synced products
  const [syncedProducts] = useState([
    { id: "1729384756", name: "ครีมกันแดด SPF50+", image: true },
    { id: "1729384921", name: "เซรั่มวิตามินซี", image: true },
    { id: "1729385102", name: "มาส์กหน้าคอลลาเจน", image: true },
  ]);

  const clipCountOptions: ClipCountOption[] = [5, 10, 25, 50, 100, "unlimited"];
  const restIntervalOptions: RestIntervalOption[] = ["30s", "1m", "2m", "5m", "10m"];
  
  const saleStyleOptions: { value: SaleStyleOption; label: string }[] = [
    { value: "hard", label: "ขายตรง" },
    { value: "soft", label: "ขายอ่อน" },
    { value: "educational", label: "ให้ความรู้" },
    { value: "storytelling", label: "เล่าเรื่อง" },
  ];

  const templateOptions: { value: TemplateOption; label: string; description: string }[] = [
    { value: "product-review", label: "รีวสินค้า (Product Review)", description: "เน้นรีวิวคุณภาพสินค้าและกลุ่มเป้าหมาย" },
    { value: "brainrot-product", label: "Brainrot + Product", description: "สไตล์ไวรัลผสมขายของ" },
    { value: "unboxing", label: "แกะกล่อง (Unboxing)", description: "เปิดกล่องสินค้าพร้อมรีวิว" },
    { value: "comparison", label: "เปรียบเทียบ (Comparison)", description: "เทียบสินค้าก่อน-หลังหรือคู่แข่ง" },
    { value: "testimonial", label: "รีวิวลูกค้า (Testimonial)", description: "เสียงจากลูกค้าจริง" },
    { value: "flash-sale", label: "Flash Sale", description: "โปรโมชั่นด่วน กระตุ้นตัดสินใจ" },
  ];

  const languageOptions: { value: LanguageOption; label: string }[] = [
    { value: "th-central", label: "ไทย" },
    { value: "th-north", label: "เหนือ" },
    { value: "th-south", label: "ใต้" },
    { value: "th-isan", label: "อีสาน" },
  ];

  const voiceToneOptions: { value: VoiceToneOption; label: string }[] = [
    { value: "energetic", label: "ดื้นเต้น/กระตือรือร้น" },
    { value: "calm", label: "สงบ" },
    { value: "friendly", label: "เป็นกันเอง" },
    { value: "professional", label: "มืออาชีพ" },
  ];

  // Determine if fields should be disabled (AI mode active)
  const isAiMode = useAiScript;

  const logs = [
    "ระบบพร้อมทำงาน...",
    "กำลังรีโหลดโมเดล AI...",
    "เชื่อมต่อระบบสำเร็จ",
  ];

  const handleCharacterUpload = (index: number) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newImages = [...characterImages];
          newImages[index] = e.target?.result as string;
          setCharacterImages(newImages);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const SectionHeader = ({ 
    icon: Icon, 
    title, 
    isOpen, 
    onToggle, 
    badge 
  }: { 
    icon: React.ElementType; 
    title: string; 
    isOpen: boolean; 
    onToggle: () => void;
    badge?: string;
  }) => (
    <button 
      onClick={onToggle}
      className="w-full flex items-center justify-between py-2"
    >
      <div className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-neon-red" />
        <span className="text-sm font-semibold text-foreground">{title}</span>
        {badge && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-neon-red/10 text-neon-red">
            {badge}
          </span>
        )}
      </div>
      <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
  );

  return (
    <div className="min-h-screen w-full max-w-[420px] mx-auto bg-background overflow-y-auto">
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
        <TabsContent value="create" className="p-4 space-y-3 mt-0 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-left-2 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 duration-200">
          
          {/* AI Scripting Section */}
          <section className="glass-card overflow-hidden">
            <div className="px-4 pt-3">
              <SectionHeader 
                icon={FileText} 
                title="สคริปต์ AI" 
                isOpen={aiScriptOpen}
                onToggle={() => setAiScriptOpen(!aiScriptOpen)}
              />
            </div>
            
            {aiScriptOpen && (
              <div className="px-4 pb-4 space-y-4">
                {/* Script Type Toggle - AI vs Manual */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">
                    ประเภทสคริปต์
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setUseAiScript(true)}
                      className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 ${
                        useAiScript 
                          ? 'bg-neon-red text-white' 
                          : 'bg-muted text-muted-foreground border border-border'
                      }`}
                    >
                      <Stars className="w-4 h-4" />
                      AI สร้างอัตโนมัติ
                    </button>
                    <button
                      onClick={() => setUseAiScript(false)}
                      className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-2 ${
                        !useAiScript 
                          ? 'bg-neon-red text-white' 
                          : 'bg-muted text-muted-foreground border border-border'
                      }`}
                    >
                      <Pencil className="w-4 h-4" />
                      เขียนเอง
                    </button>
                  </div>
                </div>

                {/* Template Selection - Always available */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">
                    เทมเพลตสคริปต์
                  </label>
                  <select 
                    value={template}
                    onChange={(e) => setTemplate(e.target.value as TemplateOption)}
                    className="w-full neon-select"
                  >
                    {templateOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-muted-foreground/70 mt-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {templateOptions.find(t => t.value === template)?.description}
                  </p>
                </div>

                {/* Prompt - Disabled in AI mode */}
                <div>
                  <label className={`text-xs mb-1.5 block flex items-center gap-1 ${isAiMode ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>
                    <RefreshCw className="w-3 h-3" />
                    คำสั่งเพิ่มเติม (Prompt)
                  </label>
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="ระบุรายละเอียดเพิ่มเติม เช่น จุดเด่นที่ต้องการเน้น, คำที่ต้องการใช้, สิ่งที่ต้องการหลีกเลี่ยง..."
                    rows={3}
                    disabled={isAiMode}
                    className={`w-full neon-textarea transition-all ${isAiMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                </div>

                {/* Sale Style & Voice Tone - Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`text-xs mb-1.5 block flex items-center gap-1 ${isAiMode ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>
                      <Mic className="w-3 h-3" />
                      น้ำเสียง & อารมณ์
                    </label>
                    <select 
                      value={voiceTone}
                      onChange={(e) => setVoiceTone(e.target.value as VoiceToneOption)}
                      disabled={isAiMode}
                      className={`w-full neon-select ${isAiMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {voiceToneOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`text-xs mb-1.5 block flex items-center gap-1 ${isAiMode ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>
                      พลังสูง
                    </label>
                    <select 
                      value={saleStyle}
                      onChange={(e) => setSaleStyle(e.target.value as SaleStyleOption)}
                      disabled={isAiMode}
                      className={`w-full neon-select ${isAiMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {saleStyleOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Language & Dialect Selection - Always available */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1.5 block flex items-center gap-1">
                      <Globe className="w-3 h-3" />
                      ภาษา
                    </label>
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as LanguageOption)}
                      className="w-full neon-select"
                    >
                      {languageOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={`text-xs mb-1.5 block flex items-center gap-1 ${isAiMode ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>
                      สำเนียง/ภาษาถิ่น
                    </label>
                    <select 
                      disabled={isAiMode}
                      className={`w-full neon-select ${isAiMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <option value="standard">มาตรฐาน</option>
                      <option value="casual">ทั่วไป</option>
                      <option value="formal">เป็นทางการ</option>
                    </select>
                  </div>
                </div>

                {/* Hook & CTA - Disabled in AI mode */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <input 
                        type="checkbox" 
                        checked={hookEnabled}
                        onChange={(e) => setHookEnabled(e.target.checked)}
                        disabled={isAiMode}
                        className={`w-3 h-3 rounded accent-neon-red ${isAiMode ? 'opacity-50' : ''}`}
                      />
                      <label className={`text-xs ${isAiMode ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>
                        ประโยคเปิด (Hook)
                      </label>
                    </div>
                    <input
                      type="text"
                      value={hookText}
                      onChange={(e) => setHookText(e.target.value)}
                      placeholder="เช่น หยุดดูคลิปนี้ก่อน..."
                      disabled={!hookEnabled || isAiMode}
                      className={`w-full neon-input text-xs ${(!hookEnabled || isAiMode) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <input 
                        type="checkbox" 
                        checked={ctaEnabled}
                        onChange={(e) => setCtaEnabled(e.target.checked)}
                        disabled={isAiMode}
                        className={`w-3 h-3 rounded accent-neon-red ${isAiMode ? 'opacity-50' : ''}`}
                      />
                      <label className={`text-xs ${isAiMode ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>
                        ปุ่มกระตุ้น (CTA)
                      </label>
                    </div>
                    <input
                      type="text"
                      value={ctaText}
                      onChange={(e) => setCtaText(e.target.value)}
                      placeholder="เช่น กดตะกร้าเลย..."
                      disabled={!ctaEnabled || isAiMode}
                      className={`w-full neon-input text-xs ${(!ctaEnabled || isAiMode) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                  </div>
                </div>

                {/* Keyword Tags - Disabled in AI mode */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`text-xs mb-1.5 block ${isAiMode ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>
                      คำสำคัญที่ต้องใช้
                    </label>
                    <input
                      type="text"
                      placeholder="ค้นด้วยเครื่องหมาย จุลภาค"
                      disabled={isAiMode}
                      className={`w-full neon-input text-xs ${isAiMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                  </div>
                  <div>
                    <label className={`text-xs mb-1.5 block ${isAiMode ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>
                      คำที่ต้องหลีกเลี่ยง
                    </label>
                    <input
                      type="text"
                      placeholder="ค้นด้วยเครื่องหมาย จุลภาค"
                      disabled={isAiMode}
                      className={`w-full neon-input text-xs ${isAiMode ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Character & Style Section */}
          <section className="glass-card overflow-hidden">
            <div className="px-4 pt-3">
              <SectionHeader 
                icon={User} 
                title="ตัวละคร & สไตล์" 
                isOpen={characterOpen}
                onToggle={() => setCharacterOpen(!characterOpen)}
              />
            </div>
            
            {characterOpen && (
              <div className="px-4 pb-4 space-y-4">
                {/* Gender Selection */}
                <div>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <User className="w-3 h-3 text-neon-red" />
                    เพศนักแสดง
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setGender("male")}
                      className={`flex-1 py-2.5 rounded-full text-xs font-medium transition-all flex items-center justify-center gap-2 ${
                        gender === "male" 
                          ? 'bg-muted border border-border text-foreground' 
                          : 'bg-muted/50 text-muted-foreground border border-transparent'
                      }`}
                    >
                      <span className="text-base">♂</span> ชาย
                    </button>
                    <button
                      onClick={() => setGender("female")}
                      className={`flex-1 py-2.5 rounded-full text-xs font-medium transition-all flex items-center justify-center gap-2 ${
                        gender === "female" 
                          ? 'bg-neon-red text-white' 
                          : 'bg-muted/50 text-muted-foreground border border-transparent'
                      }`}
                    >
                      <span className="text-base">♀</span> หญิง
                    </button>
                  </div>
                </div>

                {/* Character Upload - 2 characters only */}
                <div>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Image className="w-3 h-3 text-neon-red" />
                    รูปภาพตัวละคร (สูงสุด 2)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {characterImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => handleCharacterUpload(index)}
                        className="aspect-[3/4] rounded-xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-2 hover:border-neon-red/50 hover:bg-neon-red/5 transition-all duration-200 overflow-hidden"
                      >
                        {img ? (
                          <img src={img} alt={`Character ${index + 1}`} className="w-full h-full object-cover" />
                        ) : (
                          <>
                            <Plus className="w-6 h-6 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">ตัวที่ {index + 1}</span>
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Age Range */}
                <div>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <User className="w-3 h-3 text-neon-red" />
                    ช่วงอายุ
                  </label>
                  <select 
                    value={ageRange}
                    onChange={(e) => setAgeRange(e.target.value as AgeRangeOption)}
                    className="w-full neon-select text-xs"
                  >
                    <option value="teen">วัยรุ่น (15-20 ปี)</option>
                    <option value="young-adult">วัยผู้ใหญ่ตอนต้น (21-30 ปี)</option>
                    <option value="adult">วัยผู้ใหญ่ (31-45 ปี)</option>
                    <option value="middle-age">วัยกลางคน (46-60 ปี)</option>
                    <option value="senior">วัยสูงอายุ (60+ ปี)</option>
                  </select>
                </div>

                {/* Personality */}
                <div>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Sparkles className="w-3 h-3 text-neon-red" />
                    บุคลิกตัวละคร
                  </label>
                  <select 
                    value={personality}
                    onChange={(e) => setPersonality(e.target.value as PersonalityOption)}
                    className="w-full neon-select text-xs"
                  >
                    <option value="cheerful">วัยรุ่นสดใส/กระฉับกระเฉง</option>
                    <option value="calm">สงบ/นิ่ง</option>
                    <option value="professional">มืออาชีพ/น่าเชื่อถือ</option>
                    <option value="playful">ขี้เล่น/ตลก</option>
                    <option value="mysterious">ลึกลับ/เท่</option>
                  </select>
                </div>

                {/* Clothing Style - Multi-select buttons */}
                <div>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Settings className="w-3 h-3 text-neon-red" />
                    สไตล์การแต่งกาย
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "casual", label: "กางเกง" },
                      { value: "formal", label: "ตำลอง" },
                      { value: "fashion", label: "แฟชั่น" },
                      { value: "sporty", label: "กีฬา" },
                    ].map((style) => (
                      <button
                        key={style.value}
                        onClick={() => {
                          if (clothingStyles.includes(style.value as ClothingStyleOption)) {
                            setClothingStyles(clothingStyles.filter(s => s !== style.value));
                          } else {
                            setClothingStyles([...clothingStyles, style.value as ClothingStyleOption]);
                          }
                        }}
                        className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                          clothingStyles.includes(style.value as ClothingStyleOption)
                            ? 'bg-neon-red text-white' 
                            : 'bg-muted text-muted-foreground border border-border hover:border-neon-red/50'
                        }`}
                      >
                        <Check className={`w-3 h-3 ${clothingStyles.includes(style.value as ClothingStyleOption) ? 'opacity-100' : 'opacity-0'}`} />
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background */}
                <div>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Image className="w-3 h-3 text-neon-red" />
                    ฉากหลัง
                  </label>
                  <select 
                    value={background}
                    onChange={(e) => setBackground(e.target.value as BackgroundOption)}
                    className="w-full neon-select text-xs"
                  >
                    <option value="studio">สตูดิโอ/พื้นหลังสีพื้น</option>
                    <option value="outdoor">กลางแจ้ง/ธรรมชาติ</option>
                    <option value="home">ในบ้าน/ห้องนั่งเล่น</option>
                    <option value="office">สำนักงาน/ที่ทำงาน</option>
                    <option value="abstract">แอบสแตรกต์/กราฟิก</option>
                  </select>
                </div>

                {/* Voice Setting */}
                <div>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Mic className="w-3 h-3 text-neon-red" />
                    การตั้งค่าเสียง
                  </label>
                  <select 
                    value={voiceSetting}
                    onChange={(e) => setVoiceSetting(e.target.value as VoiceSettingOption)}
                    className="w-full neon-select text-xs"
                  >
                    <option value="original">ต้นฉบับ/กระฉับกระเฉง</option>
                    <option value="ai-generated">AI สร้างเสียง</option>
                    <option value="text-to-speech">Text-to-Speech</option>
                  </select>
                </div>

                {/* Touch Level - Slider-like buttons */}
                <div>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Palette className="w-3 h-3 text-neon-red" />
                    ความเข้ม
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">ต่ำ</span>
                    <div className="flex-1 flex gap-1">
                      {(["low", "medium", "high"] as const).map((level) => (
                        <button
                          key={level}
                          onClick={() => setTouchLevel(level)}
                          className={`flex-1 h-2 rounded-full transition-all ${
                            (level === "low" && (touchLevel === "low" || touchLevel === "medium" || touchLevel === "high")) ||
                            (level === "medium" && (touchLevel === "medium" || touchLevel === "high")) ||
                            (level === "high" && touchLevel === "high")
                              ? 'bg-neon-red' 
                              : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">สูง</span>
                  </div>
                </div>

                {/* Expression */}
                <div>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Sparkles className="w-3 h-3 text-neon-red" />
                    การแสดงออก
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "neutral", label: "ดั้น" },
                      { value: "happy", label: "ยิ้มแฉ่ง" },
                      { value: "excited", label: "ตื่นเต้น" },
                    ].map((exp) => (
                      <button
                        key={exp.value}
                        onClick={() => setExpression(exp.value as ExpressionOption)}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                          expression === exp.value
                            ? 'bg-neon-red text-white' 
                            : 'bg-muted text-muted-foreground border border-border'
                        }`}
                      >
                        {exp.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Camera Angles - Multi-select */}
                <div>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Video className="w-3 h-3 text-neon-red" />
                    การตรวจสอบออก
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "front", label: "ด้น" },
                      { value: "side", label: "อมข" },
                      { value: "close-up", label: "เขยก" },
                      { value: "full-body", label: "ค่อน" },
                      { value: "dynamic", label: "บางก" },
                    ].map((angle) => (
                      <button
                        key={angle.value}
                        onClick={() => {
                          if (cameraAngles.includes(angle.value as CameraAngleOption)) {
                            setCameraAngles(cameraAngles.filter(a => a !== angle.value));
                          } else {
                            setCameraAngles([...cameraAngles, angle.value as CameraAngleOption]);
                          }
                        }}
                        className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          cameraAngles.includes(angle.value as CameraAngleOption)
                            ? 'bg-neon-red text-white' 
                            : 'bg-muted text-muted-foreground border border-border'
                        }`}
                      >
                        {angle.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Movement */}
                <div>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <RefreshCw className="w-3 h-3 text-neon-red" />
                    การเคลื่อนไหว
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "static", label: "คำลองกา" },
                      { value: "minimal", label: "น้ำกลาง" },
                    ].map((mov) => (
                      <button
                        key={mov.value}
                        onClick={() => setMovement(mov.value as MovementOption)}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                          movement === mov.value
                            ? 'bg-neon-red text-white' 
                            : 'bg-muted text-muted-foreground border border-border'
                        }`}
                      >
                        {mov.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setMovement("static")}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all border ${
                        movement === "static"
                          ? 'border-neon-red text-neon-red bg-neon-red/10' 
                          : 'border-border text-muted-foreground bg-muted/30'
                      }`}
                    >
                      นิ่งเฉยไม่ขยับ
                    </button>
                    <button
                      onClick={() => setMovement("active")}
                      className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all border ${
                        movement === "active"
                          ? 'border-neon-red text-neon-red bg-neon-red/10' 
                          : 'border-border text-muted-foreground bg-muted/30'
                      }`}
                    >
                      เคลื่อนไหวมาก
                    </button>
                  </div>
                </div>

                {/* Warning Note */}
                <div className="p-3 rounded-lg bg-muted/30 border border-border">
                  <p className="text-xs text-muted-foreground">
                    AI จะวิเคราะห์ตัวละครของคุณและปรับแต่งให้เหมาะกับสินค้าอัตโนมัติ
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Product Data Section */}
          <section className="glass-card overflow-hidden">
            <div className="px-4 pt-3">
              <SectionHeader 
                icon={ShoppingBag} 
                title="ข้อมูลสินค้า" 
                isOpen={qualityOpen}
                onToggle={() => setQualityOpen(!qualityOpen)}
              />
            </div>
            
            {qualityOpen && (
              <div className="px-4 pb-4 space-y-4">
                {/* Product ID */}
                <div>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Link className="w-3 h-3 text-neon-red" />
                    รหัสสินค้า (TikTok)
                  </label>
                  <input
                    type="text"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    placeholder="ตัวอย่าง 1729384..."
                    className="w-full neon-input text-xs"
                  />
                </div>

                {/* Product Name */}
                <div>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <FileText className="w-3 h-3 text-neon-red" />
                    ชื่อสินค้า
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="ระบุชื่อสินค้า..."
                    className="w-full neon-input text-xs"
                  />
                </div>

                {/* Product Images */}
                <div>
                  <label className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                    <Image className="w-3 h-3 text-neon-red" />
                    รูปภาพ (สูงสุด 2)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[0, 1].map((index) => (
                      <button
                        key={index}
                        className="aspect-square rounded-xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-2 hover:border-neon-red/50 hover:bg-neon-red/5 transition-all duration-200"
                      >
                        <Plus className="w-6 h-6 text-muted-foreground" />
                        <span className="text-[10px] text-muted-foreground">คลิกเพื่อเลือก</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Info Note */}
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border">
                  <Sparkles className="w-4 h-4 text-neon-red flex-shrink-0" />
                  <p className="text-[10px] text-muted-foreground">
                    AI จะวิเคราะห์ข้อมูลสินค้าเพื่อสร้างคลิปโฆษณาได้ตรงจุด
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* Production & Preview Section */}
          <section className="glass-card overflow-hidden">
            <div className="px-4 pt-3">
              <SectionHeader 
                icon={Video} 
                title="การผลิตและพรีวิว" 
                isOpen={productionOpen}
                onToggle={() => setProductionOpen(!productionOpen)}
              />
            </div>
            
            {productionOpen && (
              <div className="px-4 pb-4 space-y-4">
                {/* Aspect Ratio */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">
                    สัดส่วนวิดีโอ (Aspect Ratio)
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setAspectRatio("9:16")}
                      className={`flex-1 py-3 px-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                        aspectRatio === "9:16" 
                          ? 'bg-neon-red text-white' 
                          : 'bg-muted border border-border text-muted-foreground'
                      }`}
                    >
                      <div className="w-4 h-7 border-2 border-current rounded-sm"></div>
                      <span className="text-[10px]">แนวตั้ง 9:16</span>
                      <span className="text-[10px] opacity-70">TikTok</span>
                    </button>
                    <button
                      onClick={() => setAspectRatio("16:9")}
                      className={`flex-1 py-3 px-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                        aspectRatio === "16:9" 
                          ? 'bg-neon-red text-white' 
                          : 'bg-muted border border-border text-muted-foreground'
                      }`}
                    >
                      <div className="w-7 h-4 border-2 border-current rounded-sm"></div>
                      <span className="text-[10px]">แนวนอน 16:9</span>
                      <span className="text-[10px] opacity-70">YouTube</span>
                    </button>
                  </div>
                </div>

                {/* Platform & Mode Selection */}
                <div className="flex items-center justify-between gap-4">
                  {/* Platform Selection */}
                  <div className="flex-1">
                    <label className="text-xs text-neon-red mb-2 block">แพลตฟอร์ม</label>
                    <div className="flex items-center bg-background rounded-xl border border-border overflow-hidden">
                      <button
                        onClick={() => setAutoPostTikTok(!autoPostTikTok)}
                        className={`flex-1 flex items-center justify-center py-3 px-4 transition-all ${
                          autoPostTikTok ? 'text-white' : 'text-muted-foreground'
                        }`}
                      >
                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                        </svg>
                      </button>
                      <div className="w-px h-8 bg-border"></div>
                      <button
                        onClick={() => setAutoPostYoutube(!autoPostYoutube)}
                        className={`flex-1 flex items-center justify-center py-3 px-4 transition-all ${
                          autoPostYoutube ? 'text-white' : 'text-muted-foreground'
                        }`}
                      >
                        <Youtube className="w-6 h-6" />
                      </button>
                    </div>
                  </div>

                  {/* Mode Selection */}
                  <div className="flex-1">
                    <label className="text-xs text-neon-red mb-2 block text-right">โหมด</label>
                    <div className="flex items-center justify-center bg-background rounded-xl border border-border py-3 px-6">
                      <Save className="w-6 h-6 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Generation Settings */}
          <section className="glass-card overflow-hidden">
            <div className="px-4 pt-3">
              <SectionHeader 
                icon={Settings} 
                title="การตั้งค่าการสร้าง" 
                isOpen={settingsOpen}
                onToggle={() => setSettingsOpen(!settingsOpen)}
              />
            </div>
            
            {settingsOpen && (
              <div className="px-4 pb-4 space-y-4">
                {/* Clip Count */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">
                    จำนวนคลิปที่ต้องการสร้าง
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {clipCountOptions.map((option) => (
                      <button
                        key={option}
                        onClick={() => setClipCount(option)}
                        className={`pill-button ${
                          clipCount === option ? "pill-button-active" : "pill-button-inactive"
                        }`}
                      >
                        {option === "unlimited" ? (
                          <span className="flex items-center gap-1">
                            <Infinity className="w-3 h-3" /> ไม่จำกัด
                          </span>
                        ) : (
                          option
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Duration & Interval */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">
                      ความยาว
                    </label>
                    <select 
                      value={videoDuration}
                      onChange={(e) => setVideoDuration(e.target.value as VideoDurationOption)}
                      className="w-full neon-select text-xs"
                    >
                      <option value="short">สั้น (8วิ)</option>
                      <option value="medium">กลาง (16วิ)</option>
                      <option value="long">ยาว (24วิ+)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-2 block">
                      ระยะเวลา (Delay)
                    </label>
                    <select 
                      value={restInterval}
                      onChange={(e) => setRestInterval(e.target.value as RestIntervalOption)}
                      className="w-full neon-select text-xs"
                    >
                      {restIntervalOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Quick Count Display */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 p-3 rounded-lg border border-border bg-muted/30 flex-1">
                    <span className="text-xs text-muted-foreground">จำนวน</span>
                    <span className="text-2xl font-bold text-neon-red">
                      {videoDuration === "short" ? 1 : videoDuration === "medium" ? 2 : 3}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground mx-3">รวมเป็น</span>
                  <div className="flex items-center gap-2 p-3 rounded-lg border border-border bg-muted/30">
                    <span className="text-lg font-bold text-neon-red">
                      {videoDuration === "short" ? "8" : videoDuration === "medium" ? "16" : "24"}วิ
                    </span>
                  </div>
                </div>

                {/* Smart Loop */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium">โหมดวนซ้ำใช้วิดีโอเดิม (Smart Loop)</span>
                  </div>
                  <Switch
                    checked={smartLoop}
                    onCheckedChange={setSmartLoop}
                    className="data-[state=checked]:bg-neon-red"
                  />
                </div>
              </div>
            )}
          </section>

          {/* Main Action Button */}
          <button className="w-full py-4 px-6 rounded-2xl font-semibold text-white bg-neon-red pulse-glow hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200">
            <span className="flex items-center justify-center gap-2">
              <Play className="w-5 h-5" />
              เริ่มสร้างวิดีโอ AI และโพสต์
            </span>
          </button>

          {/* Console Log */}
          <section className="glass-card overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-background/50">
              <Terminal className="w-4 h-4 text-neon-red" />
              <span className="text-xs font-medium">Console Log</span>
            </div>
            <div className="p-3 space-y-1 h-24 overflow-y-auto bg-background/70 font-mono text-[10px]">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className={`${
                    log.includes("สำเร็จ") ? "text-green-500" : "text-muted-foreground"
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </section>
        </TabsContent>

        {/* NetCast Pro Tab */}
        <TabsContent value="netcast" className="p-4 space-y-3 mt-0 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-right-2 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 duration-200">
          {/* Main NetCast Pro Banner */}
          <section className="glass-card p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-neon-red/20 flex items-center justify-center">
                <Radio className="w-6 h-6 text-neon-red" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-foreground">NetCast Pro</h2>
                <p className="text-xs text-muted-foreground">ระบบ AI Live Streaming อัจฉริยะ</p>
              </div>
            </div>
            <button className="w-full py-3 px-4 rounded-xl font-medium text-white bg-neon-red hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <Tv className="w-4 h-4" />
              พร้อมสตรีม
            </button>
          </section>

          {/* Smart Character Settings */}
          <section className="glass-card overflow-hidden">
            <div className="px-4 pt-3">
              <SectionHeader 
                icon={User} 
                title="ตั้งค่าตัวละครอัจฉริยะ" 
                isOpen={characterOpen}
                onToggle={() => setCharacterOpen(!characterOpen)}
                badge="HOT"
              />
            </div>
            {characterOpen && (
              <div className="px-4 pb-4 space-y-4">
                {/* Avatar Upload */}
                <div className="flex items-center gap-3">
                  <button 
                    className="w-20 h-24 rounded-xl border-2 border-dashed border-neon-red bg-muted/30 flex flex-col items-center justify-center gap-1 hover:bg-neon-red/5 transition-all"
                  >
                    <Plus className="w-5 h-5 text-neon-red" />
                    <span className="text-[10px] text-neon-red">อัปโหลด รูป/คลิป</span>
                  </button>
                  <div className="w-20 h-24 rounded-xl border border-border bg-muted/30 flex items-center justify-center">
                    <span className="text-[9px] text-muted-foreground text-center px-1">ตัวละคร จากไลบรารี</span>
                  </div>
                  <div className="w-20 h-24 rounded-xl border border-border bg-muted/30 flex items-center justify-center">
                    <span className="text-[9px] text-muted-foreground text-center px-1">ตัวอย่าง ดีไซน์เดิม</span>
                  </div>
                </div>

                {/* Language Options */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">พากษ์เสียงหลายภาษา</label>
                  <div className="flex gap-2">
                    {["TH", "EN", "CH", "JP"].map((lang, idx) => (
                      <button
                        key={lang}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                          idx === 0 
                            ? 'bg-neon-red text-white' 
                            : 'bg-muted text-muted-foreground border border-border'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">*จะใช้เสียงและคำแปลตามภาษาที่เลือกอัตโนมัติ</p>
                </div>
              </div>
            )}
          </section>

          {/* Quality & Emotion Control */}
          <section className="glass-card overflow-hidden">
            <div className="px-4 pt-3">
              <SectionHeader 
                icon={Palette} 
                title="ควบคุมภาพและอารมณ์" 
                isOpen={qualityOpen}
                onToggle={() => setQualityOpen(!qualityOpen)}
              />
            </div>
            {qualityOpen && (
              <div className="px-4 pb-4 space-y-4">
                {/* Lip Sync */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">ขยับปากตามเสียงอัตโนมัติ</label>
                  <select className="w-full neon-select">
                    <option>อัตโนมัติ</option>
                    <option>ซิงค์แม่นยำ</option>
                  </select>
                </div>

                {/* Emotion Sync */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">การแสดงออก (Emotion Sync)</label>
                  <div className="flex gap-2">
                    {["เป็นปกติ", "ร้อนรุ่ง", "เย็นชานุ่ม"].map((opt, idx) => (
                      <button
                        key={opt}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                          idx === 0 
                            ? 'bg-neon-red text-white' 
                            : 'bg-muted text-muted-foreground border border-border'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background Style */}
                <div>
                  <label className="text-xs text-muted-foreground mb-2 block">สไตล์พื้นหลัง</label>
                  <div className="flex gap-2">
                    {["เบลอโปร่ง", "โทนสี/ไวโบ", "ไม่เปลี่ยน"].map((opt, idx) => (
                      <button
                        key={opt}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                          idx === 0 
                            ? 'bg-neon-red text-white' 
                            : 'bg-muted text-muted-foreground border border-border'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Crypto Live Data */}
                <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-muted-foreground" />
                      <span className="text-xs font-medium">สตูดิโอ Crypto Live Data</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground">แสดงราคาเหรียญแบบเรียลไทม์ในสตรีม</p>
                  </div>
                  <Switch className="data-[state=checked]:bg-neon-red" />
                </div>
              </div>
            )}
          </section>

          {/* Main Action Button */}
          <button className="w-full py-4 px-6 rounded-2xl font-semibold text-white bg-neon-red pulse-glow hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200">
            <span className="flex items-center justify-center gap-2">
              <Zap className="w-5 h-5" />
              เริ่มสร้าง NetCast Pro
            </span>
          </button>
        </TabsContent>

        {/* TikTok Settings Tab */}
        <TabsContent value="tiktok" className="p-4 space-y-3 mt-0 data-[state=active]:animate-in data-[state=active]:fade-in-0 data-[state=active]:slide-in-from-right-2 data-[state=inactive]:animate-out data-[state=inactive]:fade-out-0 duration-200">
          {/* TikTok Shop Connection Banner */}
          <section className="glass-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-neon-red" />
                <span className="text-sm font-semibold text-foreground">ข้อมูลสินค้า</span>
              </div>
              <span className="text-[10px] text-muted-foreground">สำหรับเชื่อมต่อ TikTok Shop</span>
            </div>
            
            {/* Sync Button */}
            <button className="w-full py-3 rounded-xl font-medium text-white bg-neon-red hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4" />
              ซิงค์รหัสสินค้าจาก TikTok Studio
            </button>

            {/* Status */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-green-500 flex items-center gap-1">
                <Check className="w-3 h-3" />
                Studio Extension Active
              </span>
              <span className="text-muted-foreground">Last Synced: 2 mins ago</span>
            </div>
          </section>

          {/* Auto-detect Product ID */}
          <section className="glass-card p-4 space-y-3">
            <button className="w-full py-3 rounded-xl font-medium text-foreground bg-muted border border-border hover:border-neon-red/50 transition-colors flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-neon-red" />
              Auto-detect Product ID
            </button>
            <p className="text-[10px] text-muted-foreground text-center">
              ระบบจะตรวจจับรหัสสินค้าจากหน้าเว็บอัตโนมัติ
            </p>
          </section>

          {/* Synced Products List */}
          <section className="glass-card overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Link className="w-4 h-4 text-neon-red" />
                <span className="text-sm font-semibold text-foreground">รายการสินค้าที่ซิงค์</span>
              </div>
            </div>
            <div className="p-4 space-y-2">
              {syncedProducts.map((product) => (
                <div key={product.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-[10px] text-muted-foreground">
                    IMG
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{product.name}</p>
                    <p className="text-[10px] text-muted-foreground">ID: {product.id}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* n8n Connection */}
          <section className="glass-card p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-neon-red" />
              <span className="text-sm font-semibold text-foreground">เชื่อมต่อระบบอัตโนมัติ</span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              กดปุ่มด้านล่างเพื่อเชื่อมต่อ TikTok Studio กับ Extension ให้สามารถดึงข้อมูลได้อัตโนมัติ
            </p>
            <button className="w-full py-3 rounded-xl font-medium text-neon-red border border-neon-red hover:bg-neon-red/10 transition-colors flex items-center justify-center gap-2">
              <Link className="w-4 h-4" />
              เชื่อมต่อ n8n Workflow
            </button>
          </section>

          {/* Product Data Card */}
          <section className="glass-card overflow-hidden">
            <div className="px-4 pt-3">
              <SectionHeader 
                icon={ShoppingBag} 
                title="ข้อมูลสินค้า" 
                isOpen={productDataOpen}
                onToggle={() => setProductDataOpen(!productDataOpen)}
              />
            </div>
            
            {productDataOpen && (
              <div className="px-4 pb-4 space-y-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">
                    รหัสสินค้า (TikTok)
                  </label>
                  <input
                    type="text"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    placeholder="ตัวอย่าง 1729384..."
                    className="w-full neon-input"
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">
                    ใส่รหัสสินค้าจาก TikTok Shop เพื่อเชื่อมต่ออัตโนมัติ
                  </p>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">
                    ชื่อสินค้า
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="ระบุชื่อสินค้า..."
                    className="w-full neon-input"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">
                    รูปภาพ (สูงสุด 2)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {characterImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => handleCharacterUpload(index)}
                        className="aspect-square rounded-xl border-2 border-dashed border-border bg-muted/30 flex flex-col items-center justify-center gap-2 hover:border-neon-red/50 hover:bg-neon-red/5 transition-all duration-200 overflow-hidden"
                      >
                        {img ? (
                          <img src={img} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                        ) : (
                          <>
                            <Plus className="w-6 h-6 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">คลิกเพื่ออัปโหลด</span>
                          </>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* AI Product Analysis */}
          <section className="glass-card p-4 space-y-4">
            <h2 className="text-sm font-semibold text-neon-red flex items-center gap-2">
              <Wand2 className="w-4 h-4" />
              AI วิเคราะห์สินค้า
              <span className="text-[10px] text-muted-foreground font-normal ml-auto">อัตโนมัติ</span>
            </h2>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">กลุ่มเป้าหมายที่แนะนำ</span>
                  <span className="text-xs text-neon-red">AI แนะนำ</span>
                </div>
                <p className="text-sm text-foreground">วัยรุ่น-วัยทำงาน, สนใจความงาม</p>
              </div>

              <div className="p-3 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">จุดเด่นหลัก</span>
                  <span className="text-xs text-neon-red">AI แนะนำ</span>
                </div>
                <p className="text-sm text-foreground">รอข้อมูลสินค้า...</p>
              </div>

              <div className="p-3 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground">แฮชแท็กแนะนำ</span>
                  <span className="text-xs text-neon-red">AI แนะนำ</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs px-2 py-1 rounded-full bg-neon-red/10 text-neon-red">#สินค้าขายดี</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-neon-red/10 text-neon-red">#ของมันต้องมี</span>
                  <span className="text-xs px-2 py-1 rounded-full bg-neon-red/10 text-neon-red">#รีวิว</span>
                </div>
              </div>
            </div>

            <button className="w-full py-2.5 rounded-xl text-sm font-medium text-neon-red border border-neon-red hover:bg-neon-red/10 transition-colors">
              <span className="flex items-center justify-center gap-2">
                <Wand2 className="w-4 h-4" />
                วิเคราะห์ใหม่ด้วย AI
              </span>
            </button>
          </section>

          {/* Posting Schedule */}
          <section className="glass-card p-4 space-y-4">
            <h2 className="text-sm font-semibold text-neon-red flex items-center gap-2">
              <Clock className="w-4 h-4" />
              ตั้งค่าการโพสต์
            </h2>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">
                  เวลาที่ดีที่สุดสำหรับโพสต์
                </label>
                <div className="p-3 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">AI แนะนำ: 18:00 - 21:00</span>
                    <span className="text-xs text-green-500">Engagement สูง</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">
                  ความถี่ในการโพสต์
                </label>
                <select className="w-full neon-select">
                  <option value="auto">อัตโนมัติ (AI ตัดสินใจ)</option>
                  <option value="1h">ทุก 1 ชั่วโมง</option>
                  <option value="2h">ทุก 2 ชั่วโมง</option>
                  <option value="4h">ทุก 4 ชั่วโมง</option>
                  <option value="daily">วันละครั้ง</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">
                  Caption อัตโนมัติ
                </label>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                  <span className="text-sm text-foreground">ให้ AI สร้าง Caption</span>
                  <Switch defaultChecked className="data-[state=checked]:bg-neon-red" />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  AI จะสร้าง caption ที่เหมาะสมกับเนื้อหาและใส่แฮชแท็กให้อัตโนมัติ
                </p>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">
                  การแจ้งเตือน
                </label>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border">
                  <span className="text-sm text-foreground">แจ้งเตือนเมื่อโพสต์สำเร็จ</span>
                  <Switch defaultChecked className="data-[state=checked]:bg-neon-red" />
                </div>
              </div>
            </div>
          </section>

          {/* Save Button */}
          <button className="w-full py-4 px-6 rounded-2xl font-semibold text-white bg-neon-red pulse-glow hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200">
            <span className="flex items-center justify-center gap-2">
              บันทึกการตั้งค่า
            </span>
          </button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VeoflowPanel;
