export type AuthUser = {
  _id: string;
  name: string;
  email: string;
  emailVerified: string | null;
  role: string;
};

export type AuthApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type LoginResponse = AuthApiResponse<{
  token: string;
  user: AuthUser;
}>;

export type RegisterResponse = AuthApiResponse<AuthUser>;

export type PasswordResetResponse = AuthApiResponse<AuthUser>;

export type SimpleResponse = AuthApiResponse<null>;

export type AuthSession = {
  token: string;
  user: AuthUser;
};

export type ValidationIssue = {
  field: string;
  message: string;
};

export type AuthFeedback = {
  message: string;
  validationErrors: ValidationIssue[];
};

export function isAdminRole(role: string | null | undefined) {
  return role === "admin";
}

export function getHomeRouteForRole(role: string | null | undefined) {
  return isAdminRole(role) ? "/admin/dashboard" : "/user/dashboard";
}

const AUTH_SESSION_KEY = "japan-travel-ai-auth-session";
const AUTH_SESSION_EVENT = "japan-travel-ai-auth-session-change";

let cachedAuthSessionRaw: string | null = null;
let cachedAuthSessionValue: AuthSession | null = null;

export class AuthApiError extends Error {
  statusCode: number;
  validationErrors: ValidationIssue[];

  constructor(message: string, statusCode: number, validationErrors: ValidationIssue[] = []) {
    super(message);
    this.name = "AuthApiError";
    this.statusCode = statusCode;
    this.validationErrors = validationErrors;
  }
}

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000").replace(
  /\/$/,
  "",
);

const AUTH_BASE_PATH = "/api/auth";

type RequestOptions = {
  method?: "POST" | "PUT" | "PATCH";
  body?: Record<string, string>;
};

function isValidationIssue(value: unknown): value is ValidationIssue {
  return Boolean(
    value &&
      typeof value === "object" &&
      "field" in value &&
      "message" in value &&
      typeof (value as ValidationIssue).field === "string" &&
      typeof (value as ValidationIssue).message === "string",
  );
}

function parseValidationIssues(payload: unknown): ValidationIssue[] {
  if (!payload || typeof payload !== "object") {
    return [];
  }

  const candidateData = "data" in payload ? (payload as { data?: unknown }).data : undefined;
  const candidateErrors = "errors" in payload ? (payload as { errors?: unknown }).errors : undefined;
  const rawIssues = Array.isArray(candidateData)
    ? candidateData
    : Array.isArray(candidateErrors)
      ? candidateErrors
      : [];

  return rawIssues.filter(isValidationIssue);
}

function extractMessage(payload: unknown, fallbackMessage: string) {
  if (payload && typeof payload === "object" && "message" in payload) {
    const message = (payload as { message?: unknown }).message;

    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return fallbackMessage;
}

async function requestAuth<T>(path: string, options: RequestOptions): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${AUTH_BASE_PATH}${path}`, {
    method: options.method ?? "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(options.body ?? {}),
    cache: "no-store",
  });

  const payload = (await response.json().catch(() => null)) as T | { message?: string; status?: boolean; success?: boolean } | null;
  const validationErrors = parseValidationIssues(payload);
  const message = extractMessage(payload, response.ok ? "Request completed" : "Request failed");
  const hasFailureStatus =
    !response.ok ||
    Boolean(
      payload &&
        typeof payload === "object" &&
        (("status" in payload && (payload as { status?: boolean }).status === false) ||
          ("success" in payload && (payload as { success?: boolean }).success === false)),
    );

  if (hasFailureStatus) {
    throw new AuthApiError(message, response.status, validationErrors);
  }

  return payload as T;
}

export const authApi = {
  register: (body: { name: string; email: string; password: string }) =>
    requestAuth<RegisterResponse>("/register", { body }),
  login: (body: { email: string; password: string }) =>
    requestAuth<LoginResponse>("/login", { body }),
  forgotPassword: (body: { email: string }) =>
    requestAuth<SimpleResponse>("/forgot-password", { body }),
  resetPassword: (body: { token: string; password: string }) =>
    requestAuth<PasswordResetResponse>("/reset-password", { body }),
};

export function getAuthMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export function getAuthFeedback(error: unknown): AuthFeedback {
  if (error instanceof AuthApiError) {
    return {
      message: error.message,
      validationErrors: error.validationErrors,
    };
  }

  return {
    message: getAuthMessage(error),
    validationErrors: [],
  };
}

export function getAuthFeedbackToast(error: unknown) {
  const feedback = getAuthFeedback(error);

  return {
    message: feedback.message,
    details: feedback.validationErrors.map(
      (issue) => `${formatValidationField(issue.field)}: ${issue.message}`,
    ),
  };
}

export function formatValidationField(field: string) {
  const cleanedField = field.replace(/^body\./, "").replace(/^data\./, "");
  const leafField = cleanedField.split(".").pop() ?? cleanedField;

  if (!leafField) {
    return "Field";
  }

  return leafField.charAt(0).toUpperCase() + leafField.slice(1);
}

function notifyAuthSessionChange() {
  window.dispatchEvent(new Event(AUTH_SESSION_EVENT));
}

export function getAuthSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawSession = window.localStorage.getItem(AUTH_SESSION_KEY);

  if (rawSession === cachedAuthSessionRaw) {
    return cachedAuthSessionValue;
  }

  if (!rawSession) {
    cachedAuthSessionRaw = rawSession;
    cachedAuthSessionValue = null;
    return null;
  }

  try {
    const parsedSession = JSON.parse(rawSession) as AuthSession;

    cachedAuthSessionRaw = rawSession;
    cachedAuthSessionValue = parsedSession;

    return parsedSession;
  } catch {
    window.localStorage.removeItem(AUTH_SESSION_KEY);
    cachedAuthSessionRaw = null;
    cachedAuthSessionValue = null;
    return null;
  }
}

export function setAuthSession(session: AuthSession) {
  if (typeof window === "undefined") {
    return;
  }

  const rawSession = JSON.stringify(session);

  window.localStorage.setItem(AUTH_SESSION_KEY, rawSession);
  cachedAuthSessionRaw = rawSession;
  cachedAuthSessionValue = session;
  notifyAuthSessionChange();
}

export function clearAuthSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_SESSION_KEY);
  cachedAuthSessionRaw = null;
  cachedAuthSessionValue = null;
  notifyAuthSessionChange();
}

export function subscribeAuthSession(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === AUTH_SESSION_KEY || event.key === null) {
      callback();
    }
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(AUTH_SESSION_EVENT, callback);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(AUTH_SESSION_EVENT, callback);
  };
}