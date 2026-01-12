interface RequestConfig extends RequestInit {
  token?: string;
}

export class ApiService {
  private baseUrl: string;
  private token: string | null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    // Load token from localStorage if available (for persistence across page refreshes)
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    } else {
      this.token = null;
    }
  }

  setToken(token: string) {
    this.token = token;
    // Persist token to localStorage for future requests
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  clearToken() {
    this.token = null;
    // Remove token from localStorage on logout
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(config.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    // Remove Content-Type for FormData
    if (config.body instanceof FormData) {
      delete headers['Content-Type'];
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...config,
      headers,
    });

    if (!response.ok) {
      // Try to parse error response body
      let errorMessage = `API Error: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData?.message) {
          errorMessage = errorData.message;
        }
      } catch (e) {
        // If JSON parsing fails, use default error message
      }
      
      const error: any = new Error(errorMessage);
      error.status = response.status;
      error.response = { status: response.status, data: { message: errorMessage } };
      throw error;
    }

    // Check if the response is expected to be JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    
    return response.text() as unknown as T;
  }

  async get<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  async post<T>(endpoint: string, data: any, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async postFormData<T>(endpoint: string, formData: FormData, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'POST',
      body: formData,
    });
  }

  async put<T>(endpoint: string, data: any, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...config,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

}
