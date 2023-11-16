import { user } from './user.type';
import { SuccessResponse } from './utils.type';

export type AuthResponse = SuccessResponse<{
    access_token: string;
    refresh_token: string;
    expires_refresh_token: number;
    expires: number;
    user: user;
}>;

export type RefreshTokenResponse = SuccessResponse<{ access_token: string }>;
