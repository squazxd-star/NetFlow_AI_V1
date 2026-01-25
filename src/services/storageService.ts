/**
 * Service to handle secure storage of API Keys (BYOK)
 * Adapts between localStorage (Web/Dev) and chrome.storage.local (Extension)
 */

export const STORAGE_KEYS = {
    GEMINI_API_KEY: "netflow_gemini_api_key",
    LUMA_API_KEY: "netflow_luma_api_key",
    OPENAI_API_KEY: "netflow_openai_api_key"
};

export type ApiProvider = 'gemini' | 'openai' | 'luma';

export const saveApiKey = async (key: string, provider: ApiProvider = 'gemini'): Promise<void> => {
    const storageKey = provider === 'gemini' ? STORAGE_KEYS.GEMINI_API_KEY :
        provider === 'openai' ? STORAGE_KEYS.OPENAI_API_KEY :
            STORAGE_KEYS.LUMA_API_KEY;

    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        await chrome.storage.local.set({ [storageKey]: key });
    } else {
        localStorage.setItem(storageKey, key);
    }
};

export const getApiKey = async (provider: ApiProvider = 'gemini'): Promise<string | null> => {
    const storageKey = provider === 'gemini' ? STORAGE_KEYS.GEMINI_API_KEY :
        provider === 'openai' ? STORAGE_KEYS.OPENAI_API_KEY :
            STORAGE_KEYS.LUMA_API_KEY;

    // 1. Check Extension Storage first
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        const result = await chrome.storage.local.get(storageKey);
        if (result[storageKey]) {
            return result[storageKey] as string;
        }
    }

    // 2. Check LocalStorage (Web/Dev fallback)
    const localKey = localStorage.getItem(storageKey);
    if (localKey) return localKey;

    // 3. Fallback to Env var (Developer's own testing key)
    if (provider === 'gemini') {
        return import.meta.env.VITE_GEMINI_API_KEY || null;
    }
    if (provider === 'openai') {
        return import.meta.env.VITE_OPENAI_API_KEY || null;
    }
    return null;
};

export const clearApiKey = async (provider: ApiProvider = 'gemini'): Promise<void> => {
    const storageKey = provider === 'gemini' ? STORAGE_KEYS.GEMINI_API_KEY :
        provider === 'openai' ? STORAGE_KEYS.OPENAI_API_KEY :
            STORAGE_KEYS.LUMA_API_KEY;

    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
        await chrome.storage.local.remove(storageKey);
    } else {
        localStorage.removeItem(storageKey);
    }
};
