import { user } from './user.type';
import { SuccessResponse } from './utils.type';

export type AuthResponse = SuccessResponse<{
    access_token: string;
    expires: string;
    user: user;
}>;
