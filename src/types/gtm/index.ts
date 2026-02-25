export type NavSection = 'desktop' | 'mobile';
export type NavGroup = 'information' | 'community' | 'setting' | 'etc';

export type GTMCommon = {
  page_path?: string;
  method?: string;
  debug_mode?: boolean;

  item_name?: string;
  item_label?: string;
  section?: NavSection;

  nav_group?: NavGroup;
};

// 이벤트 유니온
export type GTMEvent =
  | ({ event: 'sign_up_start' } & Required<Pick<GTMCommon, 'page_path'>> & Partial<GTMCommon>)
  | ({ event: 'sign_up_submit' } & Required<Pick<GTMCommon, 'page_path'>> & Partial<GTMCommon>)
  | ({ event: 'sign_up' } & Partial<GTMCommon>)
  | ({ event: 'sign_up_abort' } & Required<Pick<GTMCommon, 'page_path'>> & Partial<GTMCommon>)
  | ({ event: 'login_start' } & Required<Pick<GTMCommon, 'page_path'>> & Partial<GTMCommon>)
  | ({ event: 'login_submit' } & Required<Pick<GTMCommon, 'page_path'>> & Partial<GTMCommon>)
  | ({ event: 'login' } & Partial<GTMCommon>)
  | ({ event: 'login_abort' } & Required<Pick<GTMCommon, 'page_path'>> & Partial<GTMCommon>)
  | ({
      event: 'nav_click';
    } & Required<Pick<GTMCommon, 'page_path' | 'item_name' | 'item_label' | 'nav_group'>> &
      Partial<GTMCommon>);
