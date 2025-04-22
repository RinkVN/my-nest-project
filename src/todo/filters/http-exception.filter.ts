import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception instanceof HttpException ? exception.getStatus() : 400;

    response.status(status).json({
      statusCode: status,
      message: exception.message || 'An error occurred',
      timestamp: new Date().toISOString(),
      path: ctx.getRequest().url,
    });
  }
}