import { DEPARTMENT_OPTIONS } from '../constants/departments';

type DepartmentOption = {
  label: string;
  value: string;
};

export const getDepartmentLabel = (
  value: string,
  options: DepartmentOption[] = DEPARTMENT_OPTIONS,
): string => {
  const match = options.find((dept) => dept.value === value);
  return match?.label ?? '기타';
};
