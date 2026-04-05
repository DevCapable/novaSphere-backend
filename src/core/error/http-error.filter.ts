import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import * as Sentry from '@sentry/nestjs';
import { ExceptionHelper } from './helper';
import { ErrorMessageEnum } from './error-message.enum';
import { LoggerService } from '../../logger/logger.service';
import { CurrentUserData } from '@app/iam/interfaces';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  logger: LoggerService;
  constructor() {
    this.logger = new LoggerService();
  }

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const currentUser = request?.user as CurrentUserData;

    let status: number;
    let errorResponse: Record<string, any> = {};

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      errorResponse = exception.getResponse() as object;

      // Check for DB errors wrapped in HttpExceptions (e.g., CustomException)
      const message = exception.message;
      if (message.includes('ORA-00001')) {
        status = HttpStatus.CONFLICT;
        errorResponse = {
          statusCode: status,
          message:
            'The record already exists or some of your input values have duplicate data that must be unique. Please check your entries and try again.',
        };
      } else if (message.includes('ORA-01400')) {
        status = HttpStatus.BAD_REQUEST;
        errorResponse = {
          statusCode: status,
          message:
            'Required fields are missing or invalid. Please provide all necessary information.',
        };
      } else if (message.includes('ORA-02291')) {
        status = HttpStatus.BAD_REQUEST;
        errorResponse = {
          statusCode: status,
          message: 'Invalid reference: The related record does not exist.',
        };
      } else if (message.includes('ORA-02292')) {
        status = HttpStatus.CONFLICT;
        errorResponse = {
          statusCode: status,
          message:
            'Cannot delete this record as it is referenced by other data.',
        };
      } else if (message.includes('ORA-00942')) {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        errorResponse = {
          statusCode: status,
          message: ErrorMessageEnum.SomethingWentWrongOnOurEnd,
        };
      } else if (message.includes('ORA-01017')) {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        errorResponse = {
          statusCode: status,
          message: ErrorMessageEnum.SomethingWentWrongOnOurEnd,
        };
      }
    } else {
      const isDbError = ExceptionHelper.isOracleDbError(exception);
      if (isDbError) {
        const driverError = (exception as any).driverError;
        if (driverError) {
          const errorNum = driverError.errorNum;
          switch (errorNum) {
            case 1: // ORA-00001: unique constraint violation
              status = HttpStatus.CONFLICT;
              errorResponse = {
                statusCode: status,
                message:
                  'The record already exists or some of your input values have duplicate data that must be unique. Please check your entries and try again.',
              };
              break;
            case 1400: // ORA-01400: cannot insert NULL into
              status = HttpStatus.BAD_REQUEST;
              errorResponse = {
                statusCode: status,
                message:
                  'Required fields are missing or invalid. Please provide all necessary information.',
              };
              break;
            case 2291: // ORA-02291: integrity constraint violated - parent key not found
              status = HttpStatus.BAD_REQUEST;
              errorResponse = {
                statusCode: status,
                message:
                  'Invalid reference: The related record does not exist.',
              };
              break;
            case 2292: // ORA-02292: integrity constraint violated - child record found
              status = HttpStatus.CONFLICT;
              errorResponse = {
                statusCode: status,
                message:
                  'Cannot delete this record as it is referenced by other data.',
              };
              break;
            case 942: // ORA-00942: table or view does not exist
              status = HttpStatus.INTERNAL_SERVER_ERROR;
              errorResponse = {
                statusCode: status,
                message: ErrorMessageEnum.SomethingWentWrongOnOurEnd,
              };
              break;
            case 1017: // ORA-01017: invalid username/password; logon denied
              status = HttpStatus.INTERNAL_SERVER_ERROR;
              errorResponse = {
                statusCode: status,
                message: ErrorMessageEnum.SomethingWentWrongOnOurEnd,
              };
              break;
            default:
              // Generic DB error
              status = HttpStatus.INTERNAL_SERVER_ERROR;
              errorResponse = {
                statusCode: status,
                message: ErrorMessageEnum.SomethingWentWrongOnOurEnd,
              };
              break;
          }
        } else {
          // Fallback if driverError is not available
          status = HttpStatus.INTERNAL_SERVER_ERROR;
          errorResponse = {
            statusCode: status,
            message: ErrorMessageEnum.SomethingWentWrongOnOurEnd,
          };
        }
      } else {
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        errorResponse = {
          statusCode: status,
          message: ErrorMessageEnum.SomethingWentWrongOnOurEnd,
        };
      }
    }

    if (ExceptionHelper.shouldCaptureExceptionInSentry(exception))
      Sentry.captureException(exception);

    let logMessage = `${request.method} ${request.url} ${status} - ${exception.message}`;
    if (currentUser)
      logMessage = `${logMessage} - user: ${JSON.stringify({ email: currentUser?.email, name: currentUser?.firstName })}`;

    this.logger.error(logMessage);

    response.status(status).json(errorResponse);
  }
}
