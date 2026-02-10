export type StatusResponse = 'pending' | 'fulfilled' | 'rejected' | 'idle';

export type Status = {
  response: StatusResponse;
  message: string;
  loading: boolean;
};

export type ApiError = {
  error: string;
  message?: string;
};
