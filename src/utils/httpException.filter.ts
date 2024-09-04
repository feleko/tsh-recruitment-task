import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        if (Array.isArray(exceptionResponse['message'])) {
          message = exceptionResponse['message'].join(', ');
        } else {
          message = exceptionResponse['message'] || exception.message;
        }
      } else {
        message = exception.message || exceptionResponse?.toString();
      }
    } else {
      message = exception.message || message;
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      time: new Date().toISOString(),
    });
  }
}
