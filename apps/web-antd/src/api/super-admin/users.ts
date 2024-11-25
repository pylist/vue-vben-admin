import { requestClient } from '#/api/request';

export namespace UsersApi {
  export interface GetUserListParams {
    username?: string;
    nickname?: string;
    email?: string;
    phone?: string;
    status?: number;
    page?: number;
    pageSize?: number;
  }
}

export async function geUserList(params: UsersApi.GetUserListParams) {
  return requestClient.get('/super/user/getUserList', { params });
}
