// src/types.ts
export interface LoginResponse {
    success: boolean;
    data?: { user: string };
    message?: string;
  }
  
export interface RegisterResponse {
    success: boolean;
    data?: { user: string };
    message?: string;
  }