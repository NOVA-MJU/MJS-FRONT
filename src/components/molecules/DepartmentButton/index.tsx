import { Link } from 'react-router-dom';
import { Typography } from '../../atoms/Typography';
import { IoIosArrowForward } from 'react-icons/io';
import { departmentMap } from '../../../constants/departments';
import { collegeMap } from '../../../constants/departments';

interface DepartmentButtonProps {
  uuid: string;
  college: string;
  departmentName: string;
  studentCouncilName?: string;
  slogan?: string;
}

export default function DepartmentButton({
  uuid,
  college,
  departmentName,
  slogan,
}: DepartmentButtonProps) {
  return (
    <Link
      to={uuid}
      className='border-grey-05 hover:bg-grey-05 flex h-fit w-full cursor-pointer flex-col gap-2 rounded-[10px] border-2 px-5 py-4'
    >
      <div className='bg-blue-05 w-fit rounded-sm px-2 py-0.5'>
        <Typography variant='caption02' className='text-blue-20'>
          {collegeMap.get(college) ?? college}
        </Typography>
      </div>
      <div className='flex w-full items-center justify-between'>
        <div className='flex flex-1 items-start gap-2'>
          <Typography variant='title02'>
            {departmentMap.get(departmentName) ?? departmentName}
          </Typography>
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
