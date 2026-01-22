import { DynamicModule, Module } from '@nestjs/common';
import { ValidationService } from './validation/validation.service';
import { boolean } from 'zod';

@Module({})
export class ValidationModule {
  static forRoot({ isGlobal }: { isGlobal: boolean }): DynamicModule {
    return {
      module: ValidationModule,
      global: isGlobal,
      providers: [ValidationService],
      exports: [ValidationService],
    };
  }
}
