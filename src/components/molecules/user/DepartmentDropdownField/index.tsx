import DropdownField from '../../common/DropdownField';

interface Props {
  label: string;
  options: Options[];
  department: string;
  setDepartment: (val: string) => void;
}

interface Options {
  label: string;
  value: string;
}

const DepartmentDropdownField = ({ label, options, department, setDepartment }: Props) => (
  <DropdownField
    label={label}
    selected={department}
    onSelect={setDepartment}
    options={options}
    placeholder={`${label}를 선택해주세요`}
  />
);

export default DepartmentDropdownField;
