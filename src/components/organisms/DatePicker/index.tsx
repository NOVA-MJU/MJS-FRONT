import { useEffect, useState } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import ko from 'date-fns/locale/ko';

interface DatePickerProps {
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
}

/**
 * 버튼 클릭 시 캘린더 모달이 표시되고, 캘린더에서 날짜 범위를 선택하면 yyyy-mm-dd 형식으로 return하는 컴포넌트입니다.
 * @param onStartDateChange 이벤트 시작일자를 받을 state를 입력하세요.
 * @param onEndDateChange 이벤트 종료일자를 받을 state를 입력하세요.
 */
export default function DatePicker({ onStartDateChange, onEndDateChange }: DatePickerProps) {
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: 'selection',
    },
  ]);

  /**
   * 날짜값을 선택할 때마다 선택한 날짜를 텍스트 값으로 변환해서 저장합니다.
   */
  useEffect(() => {
    parseDateRange(state[0].startDate, state[0].endDate);
  }, [state]);

  /**
   * DateRange 컴포넌트의 출력값을 yyyy-mm-dd 형식으로 파싱해서 부모 컴포넌트로 전달합니다.
   */
  const parseDateRange = (start?: Date | null, end?: Date | null) => {
    const formatDate = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    if (start) onStartDateChange(formatDate(start));
    if (end) onEndDateChange(formatDate(end));
  };

  return (
    <div className='flex items-center justify-center'>
      <DateRange
        editableDateInputs={true}
        showDateDisplay={false}
        onChange={(item) => setState([item.selection])}
        moveRangeOnFirstSelection={false}
        ranges={state}
        locale={ko}
      />
    </div>
  );
}
