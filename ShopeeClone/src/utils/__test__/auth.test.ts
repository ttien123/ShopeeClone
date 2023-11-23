import { describe, expect, it } from 'vitest';
import { setAccessTokenToLS, setRefreshTokenToLS } from '../auth';

const access_token =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MzZhN2QxYjExNDAwODkzZGY2ZWIyZSIsImVtYWlsIjoidGhldGllbjlhNTU1QGdtYWlsLmNvbSIsInJvbGVzIjpbIlVzZXIiXSwiY3JlYXRlZF9hdCI6IjIwMjMtMTEtMjFUMDQ6MTE6NTAuMzc2WiIsImlhdCI6MTcwMDUzOTkxMCwiZXhwIjoxNzAwNTM5OTE1fQ.xFlRnBadLjm_rfCksDv99EmIhUgKLHQ53udkb-98gmY';
const refresh_token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MzZhN2QxYjExNDAwODkzZGY2ZWIyZSIsImVtYWlsIjoidGhldGllbjlhNTU1QGdtYWlsLmNvbSIsInJvbGVzIjpbIlVzZXIiXSwiY3JlYXRlZF9hdCI6IjIwMjMtMTEtMjFUMDQ6MTE6NTAuMzc2WiIsImlhdCI6MTcwMDUzOTkxMCwiZXhwIjoxNzAwNTQzNTEwfQ.RwXxdVrxtHflVP-ROgoagwv3JsfdI6nVqUPOufPrE6E';
const profile =
    '{"_id":"6536a7d1b11400893df6eb2e","roles":["User"],"email":"thetien9a555@gmail.com","createdAt":"2023-10-23T17:05:21.362Z","updatedAt":"2023-11-13T12:39:50.340Z","__v":0,"address":"2312313","date_of_birth":"2002-03-09T17:00:00.000Z","name":"nguyen the tien","phone":"0386902560","avatar":"6316d92f-7b78-4f40-aa3c-6e16f8da4b4e.jpg"}';

describe('setAccessTokenToLS', () => {
    it('access_token được set vào localStorage', () => {
        setAccessTokenToLS(access_token);
        expect(localStorage.getItem('access_token')).toBe(access_token);
    });
});

describe('setRefreshTokenToLS', () => {
    it('refresh_token được set vào localStorage', () => {
        setRefreshTokenToLS(refresh_token);
        expect(localStorage.getItem('refresh_token')).toBe(refresh_token);
    });
});

describe('getAccessTokenFromLS', () => {
    it('lấy access_token', () => {
        setAccessTokenToLS(access_token);
        expect(localStorage.getItem('access_token')).toBe(access_token);
    });
});
describe('getRefreshTokenFromLS', () => {
    it('lấy refresh_token', () => {
        setAccessTokenToLS(refresh_token);
        expect(localStorage.getItem('refresh_token')).toBe(refresh_token);
    });
});
