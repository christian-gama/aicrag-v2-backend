import { ControllerProtocol } from '@/presentation/controllers/protocols/controller-protocol'
import { HttpRequest, HttpResponse } from '@/presentation/http/protocols'
import { Request, Response } from 'express'

export const adaptRoutes = (controller: ControllerProtocol) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = req

    const httpResponse: HttpResponse = await controller.handle(httpRequest)

    res.status(httpResponse.statusCode)
    res.json(httpResponse.data)
  }
}
