import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosClose } from 'react-icons/io';
import { FiLogIn } from 'react-icons/fi';
import { FiExternalLink } from 'react-icons/fi';

import { useAuthStore } from '@/store/useAuthStore';
import { useNavTracking } from '@/hooks/gtm/useNavTracking';
import { NAV_ITEMS } from '@/constants/nav';
import type { NavKey } from '@/types/nav/item';

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

function UserAvatar({
  profileImageUrl,
  fallbackChar,
}: {
  profileImageUrl?: string;
  fallbackChar: string;
}) {
  const [loadFailed, setLoadFailed] = useState(false);
  useEffect(() => {
    setLoadFailed(false);
  }, [profileImageUrl]);
  const showImage = profileImageUrl && profileImageUrl.trim() !== '' && !loadFailed;

  return (
    <div className='bg-grey-05 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full'>
      {showImage ? (
        <img
          src={profileImageUrl}
          alt='프로필'
          className='h-full w-full object-cover'
          onError={() => setLoadFailed(true)}
        />
      ) : (
        <span className='text-caption01 text-grey-30'>{fallbackChar}</span>
      )}
    </div>
  );
}

export default function SidebarV2({ isOpen, onClose }: SidebarV2Props) {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuthStore();
  const { trackNavClick } = useNavTracking();

  const items = useMemo<SidebarItem[]>(() => {
    const notice = findNavItem('notice');
    const department = findNavItem('department');
    const board = findNavItem('board');
    const meal = findNavItem('meal');
    const calendar = findNavItem('calendar');
    const mentor = findNavItem('mentor');
    const msi = findNavItem('msi');
    const myicap = findNavItem('myicap');

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

      // External 섹션
      {
        id: 'msi',
        label: 'MSI',
        section: 'external',
        href: msi?.href,
        navKey: msi?.key,
      },
      {
        id: 'myicap',
        label: 'MYiCap',
        section: 'external',
        href: myicap?.href,
        navKey: myicap?.key,
      },
    ];
  }, []);

  const handleItemClick = (item: SidebarItem) => {
    if (item.requiresAuth && !isLoggedIn) {
      onClose();
      navigate('/login');
      return;
    }

    if (item.navKey) {
      trackNavClick(item.navKey);
    }

    if (item.href) {
      window.open(item.href, '_blank', 'noopener,noreferrer');
      return;
    }

    if (!item.path) return;

    navigate(item.path);
    onClose();
  };

  if (!isOpen) return null;

  const informationItems = items.filter((item) => item.section === 'information');
  const communityItems = items.filter((item) => item.section === 'community');
  const settingItems = items.filter((item) => item.section === 'setting');
  const externalItems = items.filter((item) => item.section === 'external');

  return (
    <div className='fixed inset-0 z-40 flex justify-end bg-black/40'>
      {/* 패널 */}
      <aside className='flex h-full w-[320px] flex-col bg-white shadow-xl'>
        {/* 헤더 */}
        <div className='flex items-center justify-between px-5 py-4'>
          {isLoggedIn && user ? (
            <div className='flex items-center gap-3'>
              <UserAvatar
                profileImageUrl={user.profileImageUrl}
                fallbackChar={(user.nickname || user.name || '닉네임').charAt(0)}
              />
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
              className='border-grey-10 text-caption01 text-grey-40 inline-flex items-center gap-2 rounded-full border px-4 py-1.5'
            >
              <FiLogIn size={16} />
              로그인/회원가입
            </button>
          )}

          <button
            type='button'
            onClick={onClose}
            aria-label='사이드바 닫기'
            className='text-grey-30 hover:bg-grey-05 rounded-full p-1'
          >
            <IoIosClose size={24} />
          </button>
        </div>

        <div className='bg-grey-05 h-px w-full' />

        {/* 메뉴 영역 */}
        <div className='flex-1 overflow-y-auto px-5 py-4'>
          {/* Information 섹션 */}
          <section className='mb-6'>
            <h3 className='text-caption02 text-mju-primary mb-2 font-semibold'>Information</h3>
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
          <section className='mb-6'>
            <h3 className='text-caption02 text-mju-primary mb-2 font-semibold'>Community</h3>
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

          {/* Setting 섹션 */}
          <section className='mb-6'>
            <h3 className='text-caption02 text-mju-primary mb-2 font-semibold'>Setting</h3>
            <nav className='flex flex-col'>
              {settingItems.map((item) => (
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

          {/* External 링크 */}
          <section className='mt-4 flex flex-col gap-2'>
            {externalItems.map((item) =>
              item.href ? (
                <button
                  key={item.id}
                  type='button'
                  onClick={() => handleItemClick(item)}
                  className='text-caption01 text-blue-35 flex h-6 items-center gap-1 px-0'
                >
                  <span>{item.label}</span>
                  <FiExternalLink aria-hidden size={12} />
                </button>
              ) : null,
            )}
          </section>
        </div>
      </aside>
    </div>
  );
}
