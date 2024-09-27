import { AuthErrorEnums } from "../common/constants/const";
import { ApiError } from "../common/errors/ApiError";
import { AuthError } from "../common/errors/AuthError";
import {
  IApiError,
  IApiServerResponseBody,
  IUserBasicProfile,
} from "../common/interface/interface";

const ENV = import.meta.env;

const headers = new Headers();
headers.append("cache-control", "no-cache");
headers.append("Content-Type", "application/json");

const formDataHeaders = new Headers();
formDataHeaders.append("cache-control", "no-cache");
formDataHeaders.append("Content-Type", "multipart/form-data");

async function fetchWithRetry(
  path: string,
  headers: Headers,
  options?: RequestInit
): Promise<Response> {
  try {
    const url = `${ENV.VITE_API_SERVER_URL}/${path}`;

    let response = await fetch(url, {
      credentials: "include",
      ...options,
      headers,
    });

    if (response.status === 401) {
      const errorResponse = await response.json();
      if (errorResponse.errorCode === AuthErrorEnums.JWT_EXPIRED) {
        await refreshTokens(); // 토큰 갱신 시도
        // 토큰 갱신 후 원래 요청 재시도
        response = await fetch(url, {
          credentials: "include",
          ...options,
          headers,
        });
      } else {
        throw new AuthError(
          errorResponse.statusCode,
          errorResponse.errorCode,
          `AccessToken: ${errorResponse.errorCode}`
        );
      }
    }

    return response;
  } catch (error: any) {
    throw error;
  }
}

export async function refreshTokens() {
  try {
    const url = `${ENV.VITE_API_SERVER_URL}/auth/token/refresh`;

    const response = await fetch(url, {
      headers,
    });
    if (response.status === 200) {
      return await response.json();
    }

    const errorResponse: IApiError = await response.json();

    if (response.status === 401) {
      throw new AuthError(
        errorResponse.statusCode,
        errorResponse.errorCode,
        `AuthError: ${errorResponse.errorCode}`
      );
    }

    throw new ApiError(
      errorResponse.statusCode,
      errorResponse.errorCode,
      `ApiError: ${errorResponse.errorCode}`
    );
  } catch (error: any) {
    console.log("refreshTokens() error:", error);
    throw error;
  }
}

export async function fetchToServer(path: string, init?: RequestInit): Promise<Response> {
  try {
    return await fetchWithRetry(path, headers, init);
  } catch (error) {
    throw error;
  }
}

export async function fetchToServerWithFormData(
  path: string,
  init?: RequestInit
): Promise<Response> {
  try {
    return await fetchWithRetry(path, formDataHeaders, init);
  } catch (error) {
    throw error;
  }
}

export async function getMyBasicProfile(): Promise<IApiServerResponseBody<IUserBasicProfile>> {
  try {
    const result = await fetchToServer("my/basic-profile", { method: "GET" });

    return result.json();
  } catch (error) {
    throw error;
  }
}

export async function revokeTokens(): Promise<void> {
  try {
    await fetchToServer("auth/token/revoke", { method: "DELETE" });
  } catch (error) {
    throw error;
  }
}
