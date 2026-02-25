import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosClose } from 'react-icons/io';
import toast from 'react-hot-toast';

import { useAuthStore } from '@/store/useAuthStore';
import { useHeaderStore } from '@/store/useHeaderStore';
import { useNavTracking } from '@/hooks/gtm/useNavTracking';
import { NAV_ITEMS } from '@/constants/nav';
import type { NavKey } from '@/types/nav/item';
import { logout as apiLogout } from '@/api/user';

type SidebarV2Props = {
  isOpen: boolean;
  onClose: () => void;
};

type SidebarSection = 'information' | 'community' | 'setting' | 'external';

type SidebarItem = {
  id: string;
  label: string;
  section: SidebarSection;
  path?: string;
  href?: string;
  requiresAuth?: boolean;
  navKey?: NavKey;
};

const findNavItem = (key: NavKey) => NAV_ITEMS.find((item) => item.key === key);

export default function SidebarV2({ isOpen, onClose }: SidebarV2Props) {
  const navigate = useNavigate();
  const { isLoggedIn, user, resetUser } = useAuthStore();
  const { trackNavClick } = useNavTracking();
  const { setActiveMainSlide, setSelectedTab } = useHeaderStore();

  const items = useMemo<SidebarItem[]>(() => {
    const notice = findNavItem('notice');
    const department = findNavItem('department');
    const board = findNavItem('board');
    const meal = findNavItem('meal');
    const calendar = findNavItem('calendar');
    const mentor = findNavItem('mentor');
    const sso = findNavItem('sso');

    return [
      // Information 섹션
      {
        id: 'department',
        label: '학과별 정보',
        section: 'information',
        path: department?.path,
        navKey: department?.key,
      },
      {
        id: 'campus-map',
        label: '명지도',
        section: 'information',
        // TODO: 명지도 페이지 라우트가 확정되면 path 로 교체
        href: undefined,
      },
      {
        id: 'notice',
        label: '공지사항',
        section: 'information',
        path: notice?.path,
        navKey: notice?.key,
      },
      {
        id: 'calendar',
        label: '학사일정',
        section: 'information',
        path: calendar?.path,
        navKey: calendar?.key,
      },
      {
        id: 'meal',
        label: '학식',
        section: 'information',
        path: meal?.path,
        navKey: meal?.key,
      },

      // Community 섹션
      {
        id: 'info-board',
        label: '정보게시판',
        section: 'community',
        path: board?.path,
        navKey: board?.key,
      },
      {
        id: 'free-board',
        label: '자유게시판',
        section: 'community',
        path: board?.path,
        navKey: board?.key,
      },
      {
        id: 'mentor',
        label: '멘토관 서비스',
        section: 'community',
        href: mentor?.href,
        navKey: mentor?.key,
      },

      // Setting 섹션
      {
        id: 'mypage',
        label: '마이페이지',
        section: 'setting',
        path: '/mypage',
        requiresAuth: true,
      },
      {
        id: 'sso',
        label: 'SSO',
        section: 'setting',
        href: sso?.href,
        navKey: sso?.key,
      },
    ];
  }, []);

  const toNavGroup = (section: SidebarSection): 'information' | 'community' | 'setting' => {
    if (section === 'community') return 'community';
    if (section === 'setting') return 'setting';
    return 'information';
  };

  const handleItemClick = (item: SidebarItem) => {
    trackNavClick({
      item_name: item.id,
      item_label: item.label,
      nav_group: toNavGroup(item.section),
    });

    if (item.requiresAuth && !isLoggedIn) {
      onClose();
      navigate('/login');
      return;
    }

    const slideTabMap: Record<string, string> = {
      department: 'department', // 학과 → slide 0
      'campus-map': '명지도',
      notice: '공지사항',
      calendar: '학사일정',
      meal: '학식',
      'info-board': '게시판',
      'free-board': '게시판',
    };

    const tabOrSlide = slideTabMap[item.id];
    if (tabOrSlide) {
      if (tabOrSlide === 'department') {
        setActiveMainSlide(0);
      } else {
        setSelectedTab(tabOrSlide);
        setActiveMainSlide(2);
      }
      onClose();
      return;
    }

    if (item.href) {
      window.open(item.href, '_blank', 'noopener,noreferrer');
      return;
    }

    if (!item.path) return;

    navigate(item.path);
    onClose();
  };

  const handleBottomLogout = async () => {
    try {
      await apiLogout();
    } catch (e) {
      console.error('logout error:', e);
    } finally {
      resetUser();
      toast.success('로그아웃 되었습니다.');
      onClose();
      navigate('/');
    }
  };

  if (!isOpen) return null;

  const informationItems = items.filter((item) => item.section === 'information');
  const communityItems = items.filter((item) => item.section === 'community');
  const settingItems = items.filter((item) => item.section === 'setting');

  return (
    <div className='fixed inset-0 z-40 flex justify-end bg-black/40'>
      {/* 패널 */}
      <aside className='flex h-full w-[320px] flex-col bg-white shadow-xl'>
        <div className='flex items-center justify-between px-5 py-4'>
          {isLoggedIn && user ? (
            <div className='flex items-center gap-3'>
              <div className='bg-grey-05 flex h-10 w-10 items-center justify-center rounded-full'>
                <span className='text-caption01 text-grey-30'>
                  {(user.nickname || user.name || '닉네임').charAt(0)}
                </span>
              </div>
              <div className='flex flex-col'>
                <span className='text-body03 font-semibold text-black'>
                  {user.nickname || '닉네임'}
                </span>
                <span className='text-caption01 text-grey-30'>
                  @{user.studentNumber || 'id_example'}
                </span>
              </div>
            </div>
          ) : (
            <button
              type='button'
              onClick={() => {
                onClose();
                navigate('/login');
              }}
              className='inline-flex items-center'
            >
              <img src='/main/LoginBtn.svg' alt='로그인/회원가입' className='h-8 w-auto' />
            </button>
          )}

          <div className='flex items-center gap-2'>
            <button
              type='button'
              onClick={onClose}
              aria-label='사이드바 닫기'
              className='text-grey-30 hover:bg-grey-05 rounded-full p-1'
            >
              <IoIosClose size={24} />
            </button>
          </div>
        </div>

        {/* 메뉴 영역 */}
        <div className='mt-2 flex-1 overflow-y-auto px-5'>
          {/* Information 섹션 */}
          <section className='border-grey-10 mb-4 border-t pt-4'>
            <h3 className='text-caption text-mju-primary mb-2 font-semibold'>Information</h3>
            <nav className='flex flex-col'>
              {informationItems.map((item) => (
                <button
                  key={item.id}
                  type='button'
                  onClick={() => handleItemClick(item)}
                  className='text-body03 text-grey-90 hover:bg-blue-05 flex h-10 items-center rounded-md px-3'
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </section>

          {/* Community 섹션 */}
          <section className='border-grey-10 mb-4 border-t pt-4'>
            <h3 className='text-caption text-mju-primary mb-2 font-semibold'>Community</h3>
            <nav className='flex flex-col'>
              {communityItems.map((item) => (
                <button
                  key={item.id}
                  type='button'
                  onClick={() => handleItemClick(item)}
                  className='text-body03 text-grey-90 hover:bg-blue-05 flex h-10 items-center rounded-md px-3'
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </section>

          {/* My 섹션 */}
          <section className='border-grey-10 mb-6 border-t pt-4'>
            <h3 className='text-caption text-mju-primary mb-2 font-semibold'>My</h3>
            <nav className='flex flex-col'>
              {settingItems.map((item) =>
                item.href ? (
                  <button
                    key={item.id}
                    type='button'
                    onClick={() => handleItemClick(item)}
                    className='text-body03 hover:bg-blue-05 flex h-10 items-center gap-1.5 rounded-md px-3 text-black'
                  >
                    <span>{item.label}</span>
                    <img src='/main/SSO.svg' alt='' aria-hidden className='h-6 w-6 shrink-0' />
                  </button>
                ) : (
                  <button
                    key={item.id}
                    type='button'
                    onClick={() => handleItemClick(item)}
                    className='text-body03 text-grey-90 hover:bg-blue-05 flex h-10 items-center rounded-md px-3'
                  >
                    {item.label}
                  </button>
                ),
              )}
            </nav>
          </section>
        </div>

        {isLoggedIn && (
          <div className='border-grey-10 shrink-0 border-t px-5 py-4'>
            <button
              type='button'
              onClick={handleBottomLogout}
              className='flex w-full items-center justify-start'
            >
              <img src='/main/logoutBtn.svg' alt='로그아웃' className='h-8 w-auto' />
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
