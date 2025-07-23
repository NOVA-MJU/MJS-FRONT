import Divider from '../../components/atoms/Divider';
import SearchBar from '../../components/atoms/SearchBar';
import { Typography } from '../../components/atoms/Typography';
import SearchNewsItem from '../../components/molecules/SearchNewsItem';
import SearchNoticeItem from '../../components/molecules/SearchNoticeItem';
import SearchCategoryChip from '../../components/molecules/SearchCategoryChip';

export default function Search() {
  return (
    <div className='py-12 px-7 flex flex-col gap-12'>
      <SearchBar />

      <div className='flex gap-6'>
        <SearchCategoryChip text='전체' selected primary />
        <SearchCategoryChip text='공지사항' />
        <SearchCategoryChip text='명대신문' />
        <SearchCategoryChip text='자유게시판' />
        <SearchCategoryChip text='제휴' />
        <SearchCategoryChip text='취업후기' />
      </div>

      <Divider variant='default' />

      <div className='flex flex-col gap-3'>
        <div className='px-3'>
          <Typography variant='heading02' className='text-mju-primary'>
            공지사항
          </Typography>
        </div>
        <div className='border-2 border-grey-05 rounded-xl flex flex-col p-3 gap-3'>
          <SearchNoticeItem
            badgeTitle='일반공지'
            title='제목이들어갑니다 제목이들어갑니다 제목이들어갑니다'
          />
          <Divider variant='thin' />
          <SearchNoticeItem
            badgeTitle='일반공지'
            title='제목이들어갑니다 제목이들어갑니다 제목이들어갑니다'
          />
          <Divider variant='thin' />
          <SearchNoticeItem
            badgeTitle='학사공지'
            title='제목이들어갑니다 제목이들어갑니다 제목이들어갑니다'
          />
          <Divider variant='thin' />
          <SearchNoticeItem
            badgeTitle='장학공지'
            title='제목이들어갑니다 제목이들어갑니다 제목이들어갑니다'
          />
          <Divider variant='thin' />
          <SearchNoticeItem
            badgeTitle='장학공지'
            title='제목이들어갑니다 제목이들어갑니다 제목이들어갑니다'
          />
        </div>

        <div className='px-14 gap-6 flex items-center'>
          <Divider variant='thin' className='flex-1' />
          <button className='w-46 h-12 p-3 gap-2.5 bg-grey-05 rounded-xl cursor-pointer'>
            <Typography variant='body03'>더보기</Typography>
          </button>
          <Divider variant='thin' className='flex-1' />
        </div>
      </div>

      <div className='flex flex-col gap-3'>
        <div className='px-3'>
          <Typography variant='heading02' className='text-mju-primary'>
            자유게시판
          </Typography>
        </div>
        <div className='border-2 border-grey-05 rounded-xl flex flex-col p-3 gap-3'>
          <SearchNoticeItem
            badgeTitle='HOT'
            title='제목이들어갑니다 제목이들어갑니다 제목이들어갑니다'
          />
          <Divider variant='thin' />
          <SearchNoticeItem
            badgeTitle='HOT'
            title='제목이들어갑니다 제목이들어갑니다 제목이들어갑니다'
          />
          <Divider variant='thin' />
          <SearchNoticeItem
            badgeTitle='HOT'
            title='제목이들어갑니다 제목이들어갑니다 제목이들어갑니다'
          />
          <Divider variant='thin' />
          <SearchNoticeItem title='제목이들어갑니다 제목이들어갑니다 제목이들어갑니다' />
          <Divider variant='thin' />
          <SearchNoticeItem title='제목이들어갑니다 제목이들어갑니다 제목이들어갑니다' />
        </div>

        <div className='px-14 gap-6 flex items-center'>
          <Divider variant='thin' className='flex-1' />
          <button className='w-46 h-12 p-3 gap-2.5 bg-grey-05 rounded-xl cursor-pointer'>
            <Typography variant='body03'>더보기</Typography>
          </button>
          <Divider variant='thin' className='flex-1' />
        </div>
      </div>

      <div className='flex flex-col gap-3'>
        <div className='px-3'>
          <Typography variant='heading02' className='text-mju-primary'>
            명대신문
          </Typography>
        </div>

        <div className='border-2 border-grey-05 rounded-xl flex flex-col p-3 gap-3'>
          <SearchNewsItem
            imageUrl='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDAnmNUf-EgecHeBwTA1fld6hdWifH9uJLVmxVU3UrRkBW0C43iIdGiTjMK-D_BfAL33E&usqp=CAU'
            category='보도'
            title='제목이들어갑니다 제목이들어갑니다 제목이들어갑니다'
            content='미리보기가 들어갑니다 미리보기가 들어갑니다 미리보기가 들어갑니다 미리보기가 들어갑니다 미리보기가 들어갑니다 미리보기가 들어갑니다 '
          />
          <Divider variant='thin' />
          <SearchNewsItem
            imageUrl='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDAnmNUf-EgecHeBwTA1fld6hdWifH9uJLVmxVU3UrRkBW0C43iIdGiTjMK-D_BfAL33E&usqp=CAU'
            category='보도'
            title='제목이들어갑니다 제목이들어갑니다 제목이들어갑니다'
            content='미리보기가 들어갑니다 미리보기가 들어갑니다 미리보기가 들어갑니다 미리보기가 들어갑니다 미리보기가 들어갑니다 미리보기가 들어갑니다 '
          />
          <Divider variant='thin' />
          <SearchNewsItem
            category='보도'
            title='제목이들어갑니다 제목이들어갑니다 제목이들어갑니다'
            content='미리보기가 들어갑니다 미리보기가 들어갑니다 미리보기가 들어갑니다 미리보기가 들어갑니다 미리보기가 들어갑니다 미리보기가 들어갑니다 '
          />{' '}
          <Divider variant='thin' />
          <SearchNewsItem
            imageUrl='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDAnmNUf-EgecHeBwTA1fld6hdWifH9uJLVmxVU3UrRkBW0C43iIdGiTjMK-D_BfAL33E&usqp=CAU'
            category='보도'
            title='제목이들어갑니다 제목이들어갑니다 제목이들어갑니다'
            content='미리보기가 들어갑니다 미리보기가 들어갑니다 미리보기가 들어갑니다 미리보기가 들어갑니다 미리보기가 들어갑니다 미리보기가 들어갑니다 '
          />{' '}
          <Divider variant='thin' />
          <SearchNewsItem
            category='보도'
            title='제목이들어갑니다 제목이들어갑니다 제목이들어갑니다'
            content='미리보기가 들어갑니다 미리보기가 들어갑니다 미리보기가 들어갑니다 미리보기가 들어갑니다 미리보기가 들어갑니다 미리보기가 들어갑니다 '
          />{' '}
        </div>

        <div className='px-14 gap-6 flex items-center'>
          <Divider variant='thin' className='flex-1' />
          <button className='w-46 h-12 p-3 gap-2.5 bg-grey-05 rounded-xl cursor-pointer'>
            <Typography variant='body03'>더보기</Typography>
          </button>
          <Divider variant='thin' className='flex-1' />
        </div>
      </div>
    </div>
  );
}
