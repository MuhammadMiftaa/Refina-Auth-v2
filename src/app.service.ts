import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  test(): { message: string } {
    return { message: 'Hello World' };
  }
}
