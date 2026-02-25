import { gtmPush } from '../../utils/gtm';
import type { NavGroup, NavSection } from '../../types/gtm';

export function useNavTracking() {
  const getPagePath = () =>
    typeof window !== 'undefined' ? window.location.pathname + window.location.search : '/';

  const getSection = (): NavSection =>
    typeof window !== 'undefined' && window.matchMedia?.('(max-width: 767px)').matches
      ? 'mobile'
      : 'desktop';

  /** nav 아이템 클릭 추적 */
  const trackNavClick = (payload: {
    item_name: string;
    item_label: string;
    nav_group: NavGroup;
  }) => {
    gtmPush({
      event: 'nav_click',
      item_name: payload.item_name,
      item_label: payload.item_label,
      nav_group: payload.nav_group,
      section: getSection(),
      page_path: getPagePath(),
    });
  };

  return { trackNavClick };
}
