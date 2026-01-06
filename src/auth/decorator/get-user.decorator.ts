import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    // 1. Switch context to HTTP to get the request object
    const request = ctx.switchToHttp().getRequest();

    // 2. "request.user" is attached by passport/JWT Strategy automatically
    // If you use the Guard, this should be populated.

    // 3. If data is passed (e.g., @GetUser('id')), return only that field
    if (data) {
      return request.user[data];
    }

    // 4. Otherwise, return the whole user object
    return request.user;
  },
);
