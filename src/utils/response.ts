interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  code?: string;
}

export const createResponse = <T = any>(
  success: boolean,
  message: string,
  data?: T,
  error?: string,
  code?: string
): ApiResponse<T> => {
  const response: ApiResponse<T> = {
    success,
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  if (error) {
    response.error = error;
  }

  if (code) {
    response.code = code;
  }

  return response;
};

export const successResponse = <T = any>(
  message: string,
  data?: T
): ApiResponse<T> => {
  return createResponse(true, message, data);
};

export const errorResponse = (
  message: string,
  error?: string,
  code?: string
): ApiResponse => {
  return createResponse(false, message, undefined, error, code);
};
