import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Type,
  UseInterceptors,
  applyDecorators,
} from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { map, Observable } from 'rxjs';

@Injectable()
export class SerializeDtoInterceptor<TInput, TOutput> implements NestInterceptor<TInput, TOutput> {
  constructor(private readonly dtoClass: ClassConstructor<TOutput>) {}

  intercept(_context: ExecutionContext, next: CallHandler<TInput>): Observable<TOutput> {
    return next.handle().pipe(
      map((data) =>
        plainToInstance(this.dtoClass, data, {
          excludeExtraneousValues: true,
        }),
      ),
    );
  }
}

export function SerializeDto<TOutput>(dtoClass: Type<TOutput>) {
  return applyDecorators(UseInterceptors(new SerializeDtoInterceptor(dtoClass)));
}
