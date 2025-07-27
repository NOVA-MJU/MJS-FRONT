import { Link } from 'react-router-dom';
import { Typography } from '../../atoms/Typography';
import { IoIosArrowForward } from 'react-icons/io';
import { DEPARTMENT_OPTIONS } from '../../../constants/departments';

interface DepartmentButtonProps {
  uuid: string;
  college: string;
  departmentName: string;
  studentCouncilName?: string;
  slogan?: string;
}

/**
 * 학생회 이름을 넣을 공간이 없는데요
 */
export default function DepartmentButton({
  uuid,
  college,
  departmentName,
  //   studentCouncilName,
  slogan,
}: DepartmentButtonProps) {
  return (
    <Link
      to={uuid}
      className='w-full h-fit px-5 py-4 flex flex-col gap-2 border-2 border-grey-05 rounded-[10px] hover:bg-grey-05 cursor-pointer'
    >
      <div className='w-fit px-2 py-0.5 bg-blue-05 rounded-sm'>
        <Typography variant='caption02' className='text-blue-20'>
          {DEPARTMENT_OPTIONS.find((o) => o.value === college)?.label ?? college}
        </Typography>
      </div>
      <div className='w-full flex items-center justify-between'>
        <div className='flex-1 flex gap-2 items-start'>
          <Typography variant='title02'>{departmentName}</Typography>
          {/* {studentCouncilName && (
            <>
              <span aria-hidden className='h-6 w-0.5 py-0.5 bg-grey-40' />
              <Typography variant='body01'>{studentCouncilName}</Typography>
            </>
          )} */}
        </div>
        <IoIosArrowForward className='text-blue-10 text-2xl' />
      </div>
      <Typography variant='caption02' className='text-grey-40'>
        {slogan ? slogan : ''}
      </Typography>
    </Link>
  );
}
