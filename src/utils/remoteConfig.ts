export interface AutomationSelectors {
    dashboard: {
        newProjectTriggers: string[];
    };
    workspace: {
        imageTabTriggers: string[];
    };
    upload: {
        uploadButtonTriggers: string[];
        cropSaveTriggers: string[];
    };
    generation: {
        generateButtonSvgPath?: string; // Optional: identify by path content
        addToPromptTriggers: string[];
        videoTabTriggers: string[];
    };
}

export const DEFAULT_CONFIG: AutomationSelectors = {
    dashboard: {
        newProjectTriggers: [
            'โปรเจ็กต์ใหม่',
            '+ โปรเจ็กต์ใหม่',
            'New project',
            '+ New project',
            'Start new',
            'Create new',
            'สร้างโปรเจ็กต์',
            'สร้างใหม่',
            'เริ่มโปรเจ็กต์',
            'ใหม่'
        ]
    },
    workspace: {
        imageTabTriggers: ['รูปภาพ', 'Image', 'Images', 'ภาพ']
    },
    upload: {
        uploadButtonTriggers: ['อัพโหลด', 'Upload', 'เพิ่มรูป', 'Add image', '+'],
        cropSaveTriggers: ['บันทึก', 'Save', 'Done', 'ครอบตัด', 'Crop', 'ครอบตัดและบันทึก', 'Crop and save', 'ตกลง', 'OK']
    },
    generation: {
        addToPromptTriggers: ['เพิ่มไปยังพรอมต์', 'Add to prompt', 'เพิ่มไปยัง', 'Add to'],
        videoTabTriggers: ['ส่วนผสมในวิดีโอ', 'Video', 'Video mix', 'วิดีโอ', 'ผสมวิดีโอ']
    }
};

export class RemoteConfigService {
    private static instance: RemoteConfigService;
    private config: AutomationSelectors = DEFAULT_CONFIG;
    private remoteUrl: string | null = null; // Can be set to a GitHub Raw JSON URL

    private constructor() { }

    public static getInstance(): RemoteConfigService {
        if (!RemoteConfigService.instance) {
            RemoteConfigService.instance = new RemoteConfigService();
        }
        return RemoteConfigService.instance;
    }

    public async init(url?: string): Promise<void> {
        if (url) this.remoteUrl = url;
        if (this.remoteUrl) {
            try {
                console.log(`🌐 Fetching remote config from ${this.remoteUrl}...`);
                const response = await fetch(this.remoteUrl);
                if (response.ok) {
                    const data = await response.json();
                    // Basic validation could be added here
                    this.config = { ...DEFAULT_CONFIG, ...data };
                    console.log("✅ Remote config loaded successfully");
                } else {
                    console.warn(`⚠️ Failed to fetch remote config: ${response.status}. Using default.`);
                }
            } catch (e) {
                console.error("❌ Error fetching remote config:", e);
            }
        }
    }

    public getSelectors(): AutomationSelectors {
        return this.config;
    }
}
