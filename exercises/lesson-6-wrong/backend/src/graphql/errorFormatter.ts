import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { AppError } from '@/errors/AppErrors';

export function formatError(formattedError: GraphQLFormattedError, error: unknown): GraphQLFormattedError {
  // Log error for debugging (in production, use proper logging service)
  console.error('GraphQL Error:', error);

  // Extract original error
  if (error instanceof GraphQLError) {
    const originalError = error.originalError;

    // Handle our custom AppErrors
    if (originalError instanceof AppError) {
      return {
        ...formattedError,
        message: originalError.message,
        extensions: {
          ...formattedError.extensions,
          code: originalError.code,
          statusCode: originalError.statusCode,
        },
      };
    }

    // Handle Prisma errors
    if (originalError?.name === 'PrismaClientKnownRequestError') {
      const prismaError = originalError as any;

      if (prismaError.code === 'P2002') {
        return {
          ...formattedError,
          message: 'A record with this unique field already exists',
          extensions: { ...formattedError.extensions, code: 'CONFLICT', statusCode: 409 },
        };
      }

      if (prismaError.code === 'P2025') {
        return {
          ...formattedError,
          message: 'Record not found',
          extensions: { ...formattedError.extensions, code: 'NOT_FOUND', statusCode: 404 },
        };
      }
    }
  }

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production') {
    return {
      message: 'An unexpected error occurred',
      extensions: { code: 'INTERNAL_SERVER_ERROR' },
    };
  }

  // In development, return full error details
  return formattedError;
}