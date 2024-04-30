import type { AxiosProgressEvent, GenericAbortSignal } from 'axios'
import { post } from '@/utils/request'
import { homeStore, useAuthStore, useSettingStore } from '@/store'


export function fetchChatAPI<T = any>(
  prompt: string,
  options?: { conversationId?: string; parentMessageId?: string },
  signal?: GenericAbortSignal,
) {
  return post<T>({
    url: '/chat',
    data: { prompt, options },
    signal,
  })
}

export function fetchChatConfig<T = any>() {
  return post<T>({
    url: '/config',
  })
}

export function fetchChatAPIProcess<T = any>(
  params: {
    prompt: string
    options?: { conversationId?: string; parentMessageId?: string }
    signal?: GenericAbortSignal
    onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void },
) {
  const settingStore = useSettingStore()
  const authStore = useAuthStore()

  let data: Record<string, any> = {
    prompt: params.prompt,
    options: params.options,
  }

  if (authStore.isChatGPTAPI) {
    data = {
      ...data,
      systemMessage: settingStore.systemMessage,
      temperature: settingStore.temperature,
      top_p: settingStore.top_p,
    }
  }

  return post<T>({
    url: '/chat-process',
    data,
    signal: params.signal,
    onDownloadProgress: params.onDownloadProgress,
  })
}

export function fetchSession<T>() {
  if (homeStore.myData.isClient)
  return {"status":"Success","message":"","data":{"isHideServer":false,"isUpload":false,"auth":false,"model":"ChatGPTAPI","amodel":"gpt-4","isApiGallery":false,"cmodels":"","baiduId":"9d5fa7fc2f5fd585aa8fd3010d19be1e","googleId":"","notify":"","disableGpt4":"","isWsrv":"","uploadImgSize":"1","gptUrl":"","theme":"dark","isCloseMdPreview":false}}

  return post<T>({
    url: '/session',
  })
}

export function fetchVerify<T>(token: string) {
  return post<T>({
    url: '/verify',
    data: { token },
  })
}

export function fetchLogin<T>(username: string, password: string) {
  return post<T>({
    url: '/login',
    data: { username, password },
  });
}

// 注册请求
export function fetchRegister<T>(username: string, password: string,invite :string) {
  return post<T>({
    url: '/register',
    data: { username, password,invite},
  });
}


// 请求计费
export function fetchCost<T>(id:any, message:any, response:any, model:any) {
  return post<T>({
    url: '/cost',
    data: { id, message, response, model},
  });
}

// 增加查询余额的接口
export function fetchuser<T>(id:any) {
	return post<T>({
		url: '/user',
		data: {id},
	});
}
export * from "./mjapi"
export * from "./mjsave"
export * from "./openapi"
export * from "./units"
export * from "./mic"
export * from "./chat"
export * from "./sse/fetchsse"
export * from "./Recognition"

