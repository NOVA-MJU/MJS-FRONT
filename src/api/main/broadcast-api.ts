import apiClient from '../apiClient';
import type { BroadcastData } from '../../types/broadcast/broadcastInfo';

export const fetchBroadCastInfo = async (): Promise<BroadcastData> => {
  try {
    const response = await apiClient.get('/broadcast');
    return response.data;
  } catch (e) {
    console.log('방송국 정보 불러오는데 오류 발생', e);
    throw e;
  }
};
