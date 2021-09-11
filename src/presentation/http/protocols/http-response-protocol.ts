export interface HttpResponse {
  statusCode: number
  status: 'fail' | 'success'
  data: any
  accessToken?: string
}
