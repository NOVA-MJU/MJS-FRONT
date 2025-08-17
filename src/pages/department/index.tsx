import Divider from '../../components/atoms/Divider';
import { Typography } from '../../components/atoms/Typography';
import Chip from '../../components/atoms/Chip';
import { useEffect, useState } from 'react';
import DepartmentButton from '../../components/molecules/DepartmentButton';
import { COLLEGE_OPTIONS } from '../../constants/colleges';
import { getDepartments, type DepartmentRes } from '../../api/departments';

export default function Department() {
  const [departments, setDepartments] = useState<DepartmentRes[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<string>('');

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await getDepartments(selectedCollege);
        setDepartments(res);
      } catch (e) {
        console.error(e);
      }
    };
    getData();
  }, [selectedCollege]);

  return (
    <div className='flex-1 px-7 py-12 flex flex-col gap-6'>
      <Typography variant='heading01' className='text-mju-primary'>
        학과별 서비스
      </Typography>
      <Divider />
      <div className='w-full overflow-x-auto no-scrollbar'>
        <div className='w-max flex gap-6 px-2'>
          <Chip selected={selectedCollege === ''} onClick={() => setSelectedCollege('')}>
            전체
          </Chip>
          {COLLEGE_OPTIONS.map((item) => (
            <Chip
              key={item.value}
              selected={selectedCollege === item.value}
              onClick={() => setSelectedCollege(item.value)}
            >
              {item.label}
            </Chip>
          ))}
        </div>
      </div>
      {departments ? (
        <div className='grid grid-cols-4 gap-6'>
          {departments.map(
            ({ departmentUuid, college, departmentName, studentCouncilName, slogan }) => (
              <DepartmentButton
                key={departmentUuid}
                uuid={departmentUuid}
                college={college}
                departmentName={departmentName}
                studentCouncilName={studentCouncilName ?? undefined}
                slogan={slogan}
              />
            ),
          )}
        </div>
      ) : (
        <div className='flex-1 flex flex-col justify-center items-center gap-6'>
          <Typography variant='heading02'>학과 목록을 불러오는 중 문제가 발생했습니다</Typography>
          <button
            className='bg-mju-primary rounded-xl px-4 py-2 cursor-pointer'
            onClick={() => window.location.reload()}
          >
            <Typography variant='body02' className='text-white'>
              새로고침
            </Typography>
          </button>
        </div>
      )}
    </div>
  );
}
