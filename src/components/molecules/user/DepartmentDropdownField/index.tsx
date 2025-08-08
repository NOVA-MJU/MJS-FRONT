import DropdownField from '../../common/DropdownField';
import { DEPARTMENT_OPTIONS } from '../../../../constants/departments';

interface Props {
  department: string;
  setDepartment: (val: string) => void;
}

const DepartmentDropdownField: React.FC<Props> = ({ department, setDepartment }) => (
  <DropdownField
    label='학과'
    selected={department}
    onSelect={setDepartment}
    options={DEPARTMENT_OPTIONS}
    placeholder='학과를 선택해주세요'
  />
);

export default DepartmentDropdownField;
