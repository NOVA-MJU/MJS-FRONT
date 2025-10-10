// src/components/atoms/Meal/Mobile/DailyMenuView.tsx
import { useRef, useCallback } from 'react';
import type { MenuItem } from '@/api/menu';
import MenuDayButton from '@/components/molecules/MenuDayButton';
import MenuItemButton from '@/components/molecules/MenuItemButton';

type Props = {
  dateKey: string;
  items: MenuItem[];
  nowCategory?: 'BREAKFAST' | 'LUNCH' | 'DINNER';
  onPrev: () => void;
  onNext: () => void;
};

// 모바일 전용(≤md) — 하루 3끼 + 이전/다음 이동 + 스와이프
export function DailyMenuView({ dateKey, items, nowCategory, onPrev, onNext }: Props) {
  const weekday = dateKey.match(/\((.+)\)/)?.[1] ?? '';
  const row = ['BREAKFAST', 'LUNCH', 'DINNER'].map((k) => items.find((i) => i.menuCategory === k));

  // ---- swipe handling ----
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const lastX = useRef<number | null>(null);
  const movedHoriz = useRef(false);
  const THRESHOLD = 40; // 스와이프 완료 임계값(px)
  const ACTIVATE_X = 8; // 수평 제스처로 간주 시작(px)

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    startX.current = t.clientX;
    startY.current = t.clientY;
    lastX.current = t.clientX;
    movedHoriz.current = false;
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (startX.current == null || startY.current == null) return;
    const t = e.touches[0];
    lastX.current = t.clientX;

    const dx = t.clientX - startX.current;
    const dy = t.clientY - startY.current;

    if (!movedHoriz.current && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > ACTIVATE_X) {
      movedHoriz.current = true;
    }
    if (movedHoriz.current) {
      // 가로 제스처 확정 후에는 기본 스크롤/제스처 충돌 방지
      e.preventDefault();
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    if (startX.current == null) return;
    const endX = lastX.current ?? startX.current;
    const dx = endX - startX.current;

    if (movedHoriz.current && Math.abs(dx) > THRESHOLD) {
      if (dx < 0)
        onNext(); // 왼쪽으로 스와이프 → 다음
      else onPrev(); // 오른쪽으로 스와이프 → 이전
    }

    startX.current = startY.current = lastX.current = null;
    movedHoriz.current = false;
  }, [onPrev, onNext]);

  return (
    <section
      className='md:hidden rounded-lg border-2 border-grey-05 p-4 space-y-4 select-none'
      style={{ touchAction: 'pan-y' }} // 세로 스크롤 허용, 가로 제스처는 우리가 처리
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <button onClick={onPrev} aria-label='이전 날짜' className='px-2 text-sm'>
            ‹
          </button>
          <MenuDayButton label={`${weekday}요일`} focused />
          <button onClick={onNext} aria-label='다음 날짜' className='px-2 text-sm'>
            ›
          </button>
        </div>
        <span className='text-xs text-gray-500'>{dateKey}</span>
      </div>

      <div className='grid gap-2'>
        {row.map((item, idx) =>
          item ? (
            <MenuItemButton
              key={item.menuCategory}
              time={{ BREAKFAST: '아침', LUNCH: '점심', DINNER: '저녁' }[item.menuCategory]}
              menus={item.meals}
              focused={item.menuCategory === nowCategory}
            />
          ) : (
            <div
              key={idx}
              className='min-h-14 rounded-xl border border-dashed text-xs text-gray-400 flex items-center justify-center'
            >
              메뉴 없음
            </div>
          ),
        )}
      </div>
    </section>
  );
}
