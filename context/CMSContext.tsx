'use client';

import {
  SITE_NAME,
  SITE_TAGLINE,
  LOGO_PATH,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  BUSINESS_ADDRESS,
  SOCIAL_INSTAGRAM,
  SOCIAL_TIKTOK,
  SOCIAL_SNAPCHAT,
  resolveSiteLogo,
} from '@/lib/site-brand';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

interface SiteSettings {
    site_name: string;
    site_tagline: string;
    site_logo: string;
    contact_email: string;
    contact_phone: string;
    contact_whatsapp: string;
    contact_address: string;
    social_facebook: string;
    social_instagram: string;
    social_twitter: string;
    social_tiktok: string;
    social_snapchat: string;
    social_youtube: string;
    primary_color: string;
    secondary_color: string;
    currency: string;
    currency_symbol: string;
    [key: string]: string;
}

interface CMSContent {
    id: string;
    section: string;
    block_key: string;
    title: string | null;
    subtitle: string | null;
    content: string | null;
    image_url: string | null;
    button_text: string | null;
    button_url: string | null;
    metadata: Record<string, unknown>;
    is_active: boolean;
}

interface Banner {
    id: string;
    name: string;
    type: string;
    title: string | null;
    subtitle: string | null;
    image_url: string | null;
    background_color: string;
    text_color: string;
    button_text: string | null;
    button_url: string | null;
    is_active: boolean;
    position: string;
    start_date: string | null;
    end_date: string | null;
}

interface CMSContextType {
    settings: SiteSettings;
    content: CMSContent[];
    banners: Banner[];
    loading: boolean;
    getContent: (section: string, blockKey: string) => CMSContent | undefined;
    getSetting: (key: string) => string;
    getActiveBanners: (position?: string) => Banner[];
    refreshCMS: () => Promise<void>;
}

const defaultSettings: SiteSettings = {
    site_name: SITE_NAME,
    site_tagline: SITE_TAGLINE,
    site_logo: LOGO_PATH,
    contact_email: CONTACT_EMAIL,
    contact_phone: CONTACT_PHONE,
    contact_whatsapp: CONTACT_PHONE,
    contact_address: BUSINESS_ADDRESS,
    social_facebook: '',
    social_instagram: SOCIAL_INSTAGRAM,
    social_twitter: '',
    social_tiktok: SOCIAL_TIKTOK,
    social_snapchat: SOCIAL_SNAPCHAT,
    social_youtube: '',
    primary_color: '#E2187A',
    secondary_color: '#F5A3C7',
    currency: 'USD',
    currency_symbol: '$',
};

const CMSContext = createContext<CMSContextType>({
    settings: defaultSettings,
    content: [],
    banners: [],
    loading: true,
    getContent: () => undefined,
    getSetting: () => '',
    getActiveBanners: () => [],
    refreshCMS: async () => { },
});

export function CMSProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
    const [content, setContent] = useState<CMSContent[]>([]);
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchCMS = async () => {
        try {
            const [settingsRes, contentRes, bannersRes] = await Promise.all([
                supabase.from('site_settings').select('*'),
                supabase.from('cms_content').select('*').eq('is_active', true),
                supabase.from('banners').select('*').eq('is_active', true),
            ]);

            if (settingsRes.data) {
                const settingsMap: Record<string, string> = {};
                settingsRes.data.forEach((s: { key: string; value: string }) => {
                    settingsMap[s.key] = s.value;
                });
                if (settingsMap.site_logo) {
                    settingsMap.site_logo = resolveSiteLogo(settingsMap.site_logo);
                }
                setSettings({ ...defaultSettings, ...settingsMap });
            }

            if (contentRes.data) setContent(contentRes.data);
            if (bannersRes.data) setBanners(bannersRes.data);
        } catch (error) {
            console.error('CMS fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCMS();
    }, []);

    const getContent = (section: string, blockKey: string) =>
        content.find((c) => c.section === section && c.block_key === blockKey);

    const getSetting = (key: string) => settings[key] || '';

    const getActiveBanners = (position?: string) => {
        const now = new Date();
        return banners.filter((b) => {
            if (position && b.position !== position) return false;
            if (b.start_date && new Date(b.start_date) > now) return false;
            if (b.end_date && new Date(b.end_date) < now) return false;
            return true;
        });
    };

    return (
        <CMSContext.Provider
            value={{
                settings,
                content,
                banners,
                loading,
                getContent,
                getSetting,
                getActiveBanners,
                refreshCMS: fetchCMS,
            }}
        >
            {children}
        </CMSContext.Provider>
    );
}

export const useCMS = () => useContext(CMSContext);
