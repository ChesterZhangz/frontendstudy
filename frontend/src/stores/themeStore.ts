import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  isDark: boolean;
  
  // Actions
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initializeTheme: () => void;
}

const getSystemTheme = (): boolean => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const applyTheme = (isDark: boolean) => {
  if (isDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      isDark: getSystemTheme(),

      setTheme: (theme: Theme) => {
        let isDark: boolean;
        
        switch (theme) {
          case 'light':
            isDark = false;
            break;
          case 'dark':
            isDark = true;
            break;
          case 'system':
            isDark = getSystemTheme();
            break;
          default:
            isDark = getSystemTheme();
        }
        
        applyTheme(isDark);
        
        set({ theme, isDark });
      },

      toggleTheme: () => {
        const { theme } = get();
        
        if (theme === 'light') {
          get().setTheme('dark');
        } else if (theme === 'dark') {
          get().setTheme('light');
        } else {
          // 如果当前是system，则根据当前的实际主题切换
          const { isDark } = get();
          get().setTheme(isDark ? 'light' : 'dark');
        }
      },

      initializeTheme: () => {
        const { theme } = get();
        
        // 监听系统主题变化
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
          const { theme: currentTheme } = get();
          if (currentTheme === 'system') {
            applyTheme(e.matches);
            set({ isDark: e.matches });
          }
        };
        
        // 添加监听器
        mediaQuery.addEventListener('change', handleSystemThemeChange);
        
        // 应用当前主题
        get().setTheme(theme);
        
        // 清理函数（在组件卸载时调用）
        return () => {
          mediaQuery.removeEventListener('change', handleSystemThemeChange);
        };
      },
    }),
    {
      name: 'theme-storage',
      partialize: (state) => ({
        theme: state.theme,
      }),
    }
  )
);
