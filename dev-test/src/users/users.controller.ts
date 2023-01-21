import {BadRequestException, Body, Controller, Post, Request, UseFilters, UseGuards} from '@nestjs/common';
import { UsersService } from "./users.service";
import * as bcrypt from 'bcrypt';
import { LocalAuthGuard } from "../auth/guards/local.auth.guard";
import { AuthenticatedGuard } from "../auth/guards/authenticated.guard";
import { UserCredentialsDto } from "./dto/user-credentials.dto";

@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  async register(
    @Body() userCredentialsDto: UserCredentialsDto,
  ) {
    const user = await this.usersService.insertUser(
      userCredentialsDto.username,
      userCredentialsDto.password,
    );

    return {
      message: 'User registered'
    };
  }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  login(
    @Body() userCredentialsDto: UserCredentialsDto,
    @Request() req
  ): any {
    return {
      message: 'User logged in'
    };
  }

  @UseGuards(AuthenticatedGuard)
  @Post('/user/change-password')
  async changeUserPassword(
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
    @Request() req
  ) {
    console.log('--- ', req.session);
    console.log('req.user ', req.user);

    await this.usersService.updateUserPassword(req.user.userName, oldPassword, newPassword);
    req.session.destroy();

    return {
      message: 'Password changed successfully'
    };
  }
}
