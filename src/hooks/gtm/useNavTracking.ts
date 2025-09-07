import { gtmPush } from '../../utils/gtm';
import type { NavSection } from '../../types/gtm';

export function useNavTracking() {
  const page_path =
    typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/';

  const getSection = (): NavSection =>
    typeof window !== 'undefined' && window.matchMedia?.('(max-width: 767px)').matches
      ? 'mobile'
      : 'desktop';

  /** nav 아이템 클릭 추적 */
  const trackNavClick = (item_name: string) => {
    gtmPush({
      event: 'nav_click',
      item_name,
      section: getSection(),
      page_path,
    });
  };

  return { trackNavClick };
}
