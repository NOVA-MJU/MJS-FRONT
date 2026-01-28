import Divider from '../../components/atoms/Divider';
import { Typography } from '../../components/atoms/Typography';
import Chip from '../../components/atoms/Chip';
import { useEffect, useState } from 'react';
import DepartmentButton from '../../components/molecules/DepartmentButton';
import { COLLEGE_OPTIONS } from '../../constants/colleges';
import { getDepartments, type DepartmentRes } from '../../api/departments';
import GlobalErrorPage from '../error';

/**
 * 학과별 서비스 페이지
 *
 * 단과대별로 학과 목록을 조회하고 표시하는 페이지입니다.
 * 단과대 필터를 통해 학과를 필터링할 수 있습니다.
 */
export default function Department() {
  const [departments, setDepartments] = useState<DepartmentRes[]>([]);
  const [selectedCollege, setSelectedCollege] = useState<string>('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await getDepartments(selectedCollege);
        setDepartments(res);
      } catch (e) {
        console.error(e);
        setIsError(true);
      }
    })();
  }, [selectedCollege]);

  if (isError) return <GlobalErrorPage />;

  return (
    <div className='flex-1 p-4 md:p-8 flex flex-col gap-6'>
      <Typography variant='heading01' className='text-mju-primary'>
        학과별 서비스
      </Typography>
      <Divider />
      <div className='w-full overflow-x-auto no-scrollbar'>
        <div className='w-max flex gap-2 md:gap-4'>
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
      <div className='flex flex-col md:grid md:grid-cols-4 gap-6'>
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
    </div>
  );
}
