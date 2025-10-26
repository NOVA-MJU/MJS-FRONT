import { trySession } from '@/api/user';
import { useAuthStore } from '@/store/useAuthStore';
import { AxiosError } from 'axios';

interface ErrorResponse {
  status: number;
  error: string;
  message: string;
}

export const initAuth = async (): Promise<void> => {
  try {
    const me = await trySession();
    const { setLoggedIn, setUser, reset } = useAuthStore.getState();

    if (me) {
      setLoggedIn(true);
      setUser(me);
    } else {
      reset();
    }
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    const status = axiosError.response?.status;

    if (status && status !== 400) {
      console.error(
        `[initAuth] Unexpected error (${status}):`,
        axiosError.response?.data?.message ?? axiosError.message,
      );
    }

    useAuthStore.getState().reset();
  }
};
