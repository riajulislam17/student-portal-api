import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UniqueConstraintError, ValidationError } from 'sequelize';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    if (exception instanceof UniqueConstraintError) {
      const fields = Object.keys(exception.fields || {});
      return res.status(400).json({
        statusCode: 400,
        message: `Duplicate value for: ${fields.join(', ')}`,
      });
    }

    if (exception instanceof ValidationError) {
      const messages = exception.errors.map(
        (e: any) => `${e.path}: ${e.message}`,
      );
      return res.status(400).json({
        statusCode: 400,
        message: messages,
      });
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const responseBody = exception.getResponse() as any;

      return res.status(status).json({
        statusCode: status,
        message: responseBody?.message ?? responseBody ?? exception.message,
      });
    }

    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    return res.status(status).json({
      statusCode: status,
      message: 'Internal server error',
    });
  }
}
