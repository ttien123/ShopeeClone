import { user } from 'src/types/user.type';
import { SuccessResponse } from 'src/types/utils.type';
import http from 'src/utils/http';

interface bodyUpdateProfile extends Omit<user, '_id' | 'roles' | 'createdAt' | 'updatedAt' | 'email'> {
    password?: string;
    newPassword?: string;
}

const userApi = {
    getProfile() {
        return http.get<SuccessResponse<user>>('me');
    },
    updateProfile(body: bodyUpdateProfile) {
        return http.put<SuccessResponse<user>>('user', body);
    },
    uploadAvatar(body: FormData) {
        return http.post<SuccessResponse<string>>('user/upload-avatar', body, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};

export default userApi;
