import apiClient from './apiClient';

/**
 * 표준 응답 반환 형식을 정의합니다
 */
interface ApiResponse<T> {
  status: string;
  data: T;
  timestamp: string;
}

/**
 * 학과 목록을 조회합니다
 * @param college 필터링할 단과대학을 입력하세요
 * @returns Department[] 형태의 학과 목록을 반환합니다
 */
interface Department {
  departmentUuid: string;
  departmentName: string;
  studentCouncilName: string | null;
  studentCouncilLogo: string | null;
  slogan: string;
  college: string;
}

export const getDepartments = async (college?: string) => {
  const res = await apiClient.get<ApiResponse<Department[]>>('/departments/info', {
    params: college ? { college } : undefined,
  });
  return res.data;
};

/**
 * 특정 학과의 학생회, 슬로전, 설명, SNS 정보 등 상세 정보를 조회합니다
 * @param uuid 학과의 uuid를 입력하세요
 * @returns
 */
interface DepartmentDetail {
  departmentUuid: string;
  departmentName: string;
  studentCouncilName: string | null;
  studentCouncilLogo: string | null;
  studentCouncilContactEmail: string | null;
  slogan: string;
  description: string;
  instagramUrl: string;
  homepageUrl: string;
  college: string;
}

export const getDepartmentInfo = async (departmentUuid: string): Promise<DepartmentDetail> => {
  const res = await apiClient.get<ApiResponse<DepartmentDetail>>(
    `/departments/info/${departmentUuid}`,
  );
  return res.data.data;
};
