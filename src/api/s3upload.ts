import apiClient from './apiClient';

const S3_UPLOAD_UUID = '4be35d77-4767-4e2d-837a-a2e7f9e9a802';

export const DOMAIN_VALUES = [
  'COMMUNITY_POST',
  'PROFILE_IMAGE',
  'DEPARTMENT_LOGO',
  'DEPARTMENT_SCHEDULE',
  'DEPARTMENT_NOTICE',
] as const;

export type UploadDomain = (typeof DOMAIN_VALUES)[number];

type S3UploadResponse = { success: boolean; data: string };

export const uploadS3 = async (file: File, domain: UploadDomain): Promise<string> => {
  const form = new FormData();
  form.append('file', file);
  form.append('domain', domain);
  form.append('uuid', S3_UPLOAD_UUID);

  const { data } = await apiClient.post<S3UploadResponse>('/s3/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data.data;
};
