import { create } from 'zustand';

interface HeaderState {
  activeMainSlide: number;
  setActiveMainSlide: (index: number) => void;
  selectedTab: string | null;
  setSelectedTab: (tab: string | null) => void;
}

export const useHeaderStore = create<HeaderState>((set) => ({
  activeMainSlide: 1, // 기본값: 중앙 메인 홈
  setActiveMainSlide: (index) => set({ activeMainSlide: index }),
  selectedTab: null,
  setSelectedTab: (tab) => set({ selectedTab: tab }),
}));
