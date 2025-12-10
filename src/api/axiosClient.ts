import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { mockUsers } from '../mocks/users'

const USE_MOCK = true

class AxiosClient {
  private axiosInstance: AxiosInstance
  private abortController: AbortController | null = null

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: USE_MOCK ? '' : 'https://jsonplaceholder.typicode.com',
      timeout: USE_MOCK ? 3000 : 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    this.axiosInstance.interceptors.request.use(
      (config: any) => {
        if (!USE_MOCK) {
          config.headers = config.headers || {}
          config.headers.Authorization = 'Bearer demo-token-12345'
        }

        this.abortController = new AbortController()
        config.signal = this.abortController.signal

        console.log('Отправка запроса:', {
          url: config.url,
          method: config.method,
          mode: USE_MOCK ? 'MOCK' : 'REAL',
        })

        return config
      },
      (error: any) => {
        console.error('Ошибка в запросе:', error)
        return Promise.reject(error)
      }
    )

    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        console.log('Получен ответ:', {
          status: response.status,
          mode: USE_MOCK ? 'MOCK' : 'REAL',
        })
        return response
      },
      (error: any) => {
        if (axios.isCancel(error)) {
          console.log('Запрос отменен:', error.message)
          return Promise.reject(new Error('Запрос отменен пользователем'))
        } else {
          console.error('Ошибка ответа:', error)
        }
        return Promise.reject(error)
      }
    )
  }

  public getInstance(): AxiosInstance {
    return this.axiosInstance
  }

  public cancelRequest(): void {
    if (this.abortController) {
      this.abortController.abort('Запрос отменен пользователем')
      this.abortController = null
    }
  }

  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    if (USE_MOCK) {
      console.log('Используются мок-данные для GET:', url)
      
      await new Promise(resolve => setTimeout(resolve, 500))

      if (config?.signal?.aborted) {
        throw new Error('Запрос отменен пользователем')
      }
      
      if (url.includes('/users')) {
        const limitMatch = url.match(/_limit=(\d+)/)
        const limit = limitMatch ? parseInt(limitMatch[1]) : 10
        
        return mockUsers.slice(0, limit) as any
      }
      
      return [] as any
    }
    
    try {
      const response = await this.axiosInstance.get<T>(url, config)
      return response.data
    } catch (error: any) {
      console.error('GET error:', error.message)
      throw error
    }
  }

  public async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    if (USE_MOCK) {
      console.log('Используются мок-данные для POST:', url, data)
      await new Promise(resolve => setTimeout(resolve, 300))
      
      if (config?.signal?.aborted) {
        throw new Error('Запрос отменен пользователем')
      }

      if (url.includes('/users')) {
        const newUser = {
          id: mockUsers.length + 1,
          ...data,
        }
        console.log('Создан пользователь:', newUser)
        return newUser as any
      }
      
      return data as any
    }
    
    try {
      const response = await this.axiosInstance.post<T>(url, data, config)
      return response.data
    } catch (error: any) {
      console.error('POST error:', error.message)
      throw error
    }
  }

  public async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    if (USE_MOCK) {
      console.log('Используются мок-данные для PUT:', url, data)
      await new Promise(resolve => setTimeout(resolve, 300))
      
      if (config?.signal?.aborted) {
        throw new Error('Запрос отменен пользователем')
      }
      
      if (url.includes('/users/')) {
        const id = parseInt(url.split('/').pop() || '0')
        const user = mockUsers.find(u => u.id === id)
        const updatedUser = { ...user, ...data }
        console.log('Обновлен пользователь:', updatedUser)
        return updatedUser as any
      }
      
      return data as any
    }
    
    try {
      const response = await this.axiosInstance.put<T>(url, data, config)
      return response.data
    } catch (error: any) {
      console.error('PUT error:', error.message)
      throw error
    }
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    if (USE_MOCK) {
      console.log('Используются мок-данные для DELETE:', url)
      await new Promise(resolve => setTimeout(resolve, 300))
      
      if (config?.signal?.aborted) {
        throw new Error('Запрос отменен пользователем')
      }
      
      console.log('Удален пользователь:', url)
      return { success: true } as any
    }
    
    try {
      const response = await this.axiosInstance.delete<T>(url, config)
      return response.data
    } catch (error: any) {
      console.error('DELETE error:', error.message)
      throw error
    }
  }
}

export const axiosClient = new AxiosClient()
export default axiosClient