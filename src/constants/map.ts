export type BuildingCategory = '건물' | '캠퍼스 시설' | '편의시설' | '기타';

export type Building = {
  id: string;
  name: string;
  category: BuildingCategory;
  campus: string;
};

export type CampusData = {
  name: string;
  buildings: Building[];
};

export const MAP_DATA = {
  titles: {
    CAMPUS: '캠퍼스',
    BUILDING: '건물',
    CAMPUS_FACILITY: '캠퍼스 시설',
    AMENITY: '편의시설',
  },
  campuses: [
    {
      name: '인문캠퍼스',
      buildings: [
        // 건물
        { id: 'b-1', name: '종합관(구 본관)', category: '건물', campus: '인문캠퍼스' },
        { id: 'b-2', name: '학생회관', category: '건물', campus: '인문캠퍼스' },
        { id: 'b-3', name: '미래관', category: '건물', campus: '인문캠퍼스' },
        { id: 'b-4', name: '국제관(구 경상관)', category: '건물', campus: '인문캠퍼스' },
        { id: 'b-5', name: '행정동', category: '건물', campus: '인문캠퍼스' },
        { id: 'b-6', name: '생활관', category: '건물', campus: '인문캠퍼스' },
        { id: 'b-7', name: '방목학술정보관(도서관)', category: '건물', campus: '인문캠퍼스' },
        { id: 'b-8', name: 'MCC', category: '건물', campus: '인문캠퍼스' },

        // 캠퍼스 시설
        { id: 'f-1', name: '학생식당', category: '캠퍼스 시설', campus: '인문캠퍼스' },
        { id: 'f-2', name: '캠퍼스 출입구', category: '캠퍼스 시설', campus: '인문캠퍼스' },
        {
          id: 'f-3',
          name: '건물 출입구/통로/지름길',
          category: '캠퍼스 시설',
          campus: '인문캠퍼스',
        },
        { id: 'f-4', name: '운동 시설', category: '캠퍼스 시설', campus: '인문캠퍼스' },
        { id: 'f-5', name: '주차장', category: '캠퍼스 시설', campus: '인문캠퍼스' },
        { id: 'f-6', name: '흡연 부스', category: '캠퍼스 시설', campus: '인문캠퍼스' },

        // 편의시설
        { id: 'p-1', name: '편의점/마트', category: '편의시설', campus: '인문캠퍼스' },
        { id: 'p-2', name: '음식점', category: '편의시설', campus: '인문캠퍼스' },
        { id: 'p-3', name: '카페', category: '편의시설', campus: '인문캠퍼스' },
        { id: 'p-4', name: '운동', category: '편의시설', campus: '인문캠퍼스' },
        { id: 'p-5', name: '야식트럭', category: '편의시설', campus: '인문캠퍼스' },
        { id: 'p-6', name: '은행/우편', category: '편의시설', campus: '인문캠퍼스' },
        { id: 'p-7', name: '기타', category: '편의시설', campus: '인문캠퍼스' },
      ],
    },
  ] as CampusData[],
};

export const MAP_CATEGORIES: Record<string, BuildingCategory> = {
  BUILDING: '건물',
  FACILITY: '캠퍼스 시설',
  AMENITY: '편의시설',
  ETC: '기타',
};
