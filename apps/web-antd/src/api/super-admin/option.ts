import { requestClient } from '#/api/request';

export namespace OptionApi {
  export interface OptionParams {
    key: string;
    value: string;
  }
  export interface SetOptionsParams {
    options: OptionParams[];
  }
  export interface GetOptionsResponse {
    items: OptionParams[];
  }
}

export async function getOptions() {
  return requestClient.get<OptionApi.GetOptionsResponse>('/option/getOptions');
}

export async function setOptions(data: Record<string, any>) {
  return requestClient.post('/option/setOptions', data);
}
