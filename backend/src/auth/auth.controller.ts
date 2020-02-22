import { Controller, Get, Post, UnauthorizedException, UsePipes, Body, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';

interface LogInSchema {
  email: string,
  password: string
}

// const logInSchema = {
//   email: Joi.string().required(),
//   password: Joi.string().required()
// };

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  // @UsePipes(new JoiValidationPipe(logInSchema))
  async logIn(@Body() params: LogInSchema) {

    const user = await this.authService.findByCredentials(params.email, params.password);
    if (!user) {
      throw new UnauthorizedException();
    }
    const session = await this.authService.createSession(user);

    return {
      token: session.token,
      user: {
        id: user.id,
        name: user.name
      }
    };
  }

  @Get('status')
  @UseGuards(AuthGuard())
  status(@Req() req: Request) {
    if (req.auth && req.auth.user) {
      return {
        name: req.auth.user.name
      };
    } else {
      throw new UnauthorizedException();
    }
  }

  @Get('logout')
  @UseGuards(AuthGuard())
  async logOut(@Req() req: Request) {
    await req.auth.session.remove();
  }

}
