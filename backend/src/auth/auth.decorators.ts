import { createParamDecorator } from '@nestjs/common';

export const AuthSession = createParamDecorator((data, [root, args, ctx, info]) => ctx.req.auth && ctx.req.auth.session);
export const AuthUser = createParamDecorator((data, [root, args, ctx, info]) => ctx.req.auth && ctx.req.auth.user);
