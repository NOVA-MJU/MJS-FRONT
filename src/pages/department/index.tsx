import Divider from '../../components/atoms/Divider';
import Chip from '../../components/atoms/Chip';
import { useState } from 'react';
import DepartmentButton from '../../components/molecules/DepartmentButton';
import { COLLEGE_OPTIONS } from '../../constants/departments';

export default function Department() {
  const [departments] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState<string>('');

  return (
    <div className='flex flex-1 flex-col gap-6 p-4 md:p-8'>
      <p className='text-heading01 text-mju-primary'>학과별 서비스</p>
      <Divider />
      <div className='no-scrollbar w-full overflow-x-auto'>
        <div className='flex w-max gap-2 md:gap-4'>
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
      <div className='flex flex-col gap-6 md:grid md:grid-cols-4'>
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
