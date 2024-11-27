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

  export interface CreateUserParams {
    nickName?: string;
    username: string;
    password: string;
  }

  export interface UpdateUserParams {
    id: number;
    nickName?: string;
    status?: number;
  }

  export interface DeleteUserParams {
    id: number;
  }
}

export async function geUserListApi(params: UsersApi.GetUserListParams) {
  return requestClient.get('/super/user/getUserList', { params });
}

export async function createUserApi(data: UsersApi.CreateUserParams) {
  return requestClient.post('/super/user/createUser', data);
}

export async function updateUserApi(data: UsersApi.UpdateUserParams) {
  return requestClient.post('/super/user/updateUser', data);
}

export async function deleteUserApi(data: UsersApi.DeleteUserParams) {
  return requestClient.post('/super/user/deleteUser', data);
}
