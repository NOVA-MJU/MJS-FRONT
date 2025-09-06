export type GTMCommon = {
  page_path?: string;
  method?: string;
  debug_mode?: boolean;
};

// 이벤트 유니온
export type GTMEvent =
  | ({ event: 'sign_up_start' } & Required<Pick<GTMCommon, 'page_path'>> & Partial<GTMCommon>)
  | ({ event: 'sign_up_submit' } & Required<Pick<GTMCommon, 'page_path'>> & Partial<GTMCommon>)
  | ({ event: 'sign_up' } & Partial<GTMCommon>)
  | ({ event: 'sign_up_abort' } & Required<Pick<GTMCommon, 'page_path'>> & Partial<GTMCommon>);
