/**
 * Authentication-related types for the Hina application.
 */

/**
 * User profile information from Supabase Auth.
 */
export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

/**
 * Authentication error response.
 */
export interface AuthError {
  message: string;
  status?: number;
}

/**
 * Sign up form data.
 */
export interface SignUpData {
  email: string;
  password: string;
  fullName?: string;
}

/**
 * Sign in form data.
 */
export interface SignInData {
  email: string;
  password: string;
}

