/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React, { useEffect, useMemo, useState } from 'react';
import { getWeeklyMenu } from '../../api/mealApi';
import LoadingComponent from '../../components/util/LoadingComponent';
import { useTable } from 'react-table';

const mealTableStyle = css`
  display: flex;
  flex-direction: column;
  width: 1280px;
  font-family: 'Arial', sans-serif;

  table {
    width: 100%;
    background-color: #ffffff;
    border-collapse: collapse;
    margin-top: 10px;
    border-radius: 10px;
    height: 50vh;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  th,
  td {
    border: 1px solid #ddd;
    padding: 12px;
    color: gray;
    text-align: center;
    vertical-align: middle;
    font-size: 17px;
  }

  td:hover {
    background-color: aliceblue;
  }

  th {
    color: gray;
    padding: 17px;
  }
`;

const mealTitleStyle = css`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  margin-bottom: 20px;
  strong {
    font-size: 20px;
    color: black;
    margin-right: 15px;
  }

  span {
    color: gray;
    font-size: 17px;
  }
`;

const todayDateTextStyle = css`
  font-weight: bold !important;
  font-style: italic;
`;

const dateTextStyle = css`
  font-weight: 400;
`;

const menuTextStyle = css`
  white-space: pre-line;
  text-align: left;
  line-height: 1.8;
  padding: 10px;
  color: gray;
`;

const todayHighlightStyle = css`
  font-style: italic;
`;

const todayColumnHighlight = css`
  background-color: aliceblue;
`;

const mealTypeCellStyle = css`
  text-align: center !important;
  color: #333;
`;

const normalizeDateKey = (dateStr) => dateStr.replace(/\D/g, '');

const MealPage = () => {
  const [loading, setLoading] = useState(true);
  const [mealData, setMealData] = useState([]);

  useEffect(() => {
    const fetchMealData = async () => {
      try {
        const response = await getWeeklyMenu();
        setMealData(response);
      } catch (error) {
        console.error('식단 불러오기 실패', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMealData();
  }, []);

  const todayKey = useMemo(() => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${month}${day}`;
  }, []);

  const allDates = useMemo(() => {
    return Array.from(new Set(mealData.map((item) => item.date)));
  }, [mealData]);

  const normalizedDateMap = useMemo(() => {
    return Object.fromEntries(
      allDates.map((date) => [date, normalizeDateKey(date)])
    );
  }, [allDates]);

  const transposedData = useMemo(() => {
    if (!mealData || mealData.length === 0) return [];

    const mealTypes = ['BREAKFAST', 'LUNCH', 'DINNER'];

    return mealTypes.map((mealType) => {
      const row = { mealType };
      allDates.forEach((date) => {
        const normalizedKey = normalizedDateMap[date];
        const found = mealData.find(
          (item) => item.date === date && item.menuCategory === mealType
        );
        row[normalizedKey] = found ? found.meals.join('\n') : '';
      });
      return row;
    });
  }, [mealData, allDates, normalizedDateMap]);

  const mealTypeToKorean = (type) => {
    switch (type) {
      case 'BREAKFAST':
        return '조식';
      case 'LUNCH':
        return '중식';
      case 'DINNER':
        return '석식';
      default:
        return type;
    }
  };

  const transposedColumns = useMemo(() => {
    return [
      { accessor: 'mealType', Header: '' },
      ...allDates.map((date) => ({
        accessor: normalizedDateMap[date],
        Header: date,
      })),
    ];
  }, [allDates, normalizedDateMap]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns: transposedColumns,
      data: transposedData,
    });

  const firstDate = allDates[0] || '';
  const lastDate = allDates[4] || '';

  return (
    <div css={mealTableStyle}>
      <div css={mealTitleStyle}>
        <strong>식단 </strong>
        <span>인문캠퍼스 학생회관 3층 </span>
        <span style={{ marginLeft: '10px' }}>
          [{firstDate} - {lastDate}]
        </span>
      </div>

      {loading ? (
        <LoadingComponent message="식단 정보를 불러오고 있습니다." />
      ) : transposedData.length === 0 ? (
        <div>식단 정보가 없습니다.</div>
      ) : (
        <table {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    key={column.id}
                    {...column.getHeaderProps()}
                    css={
                      column.id === todayKey
                        ? [todayColumnHighlight, todayDateTextStyle]
                        : [dateTextStyle]
                    }
                    style={{ width: '40px' }}
                  >
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
              prepareRow(row);
              return (
                <tr key={row.id} {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td
                      key={cell.column.id}
                      {...cell.getCellProps()}
                      css={
                        cell.column.id === todayKey
                          ? todayColumnHighlight
                          : undefined
                      }
                    >
                      <div
                        css={
                          cell.column.id === 'mealType'
                            ? mealTypeCellStyle
                            : cell.column.id === todayKey
                            ? [menuTextStyle, todayHighlightStyle]
                            : menuTextStyle
                        }
                      >
                        {cell.column.id === 'mealType'
                          ? mealTypeToKorean(cell.value)
                          : cell.render('Cell')}
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MealPage;
