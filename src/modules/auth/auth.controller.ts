import {
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoggedInDto, SigninDto, SignupDto } from './dto';
import { ChangepasswordDto } from './dto/changepassword.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('/signup')
  @UsePipes(ValidationPipe)
  signup(@Body() signupDto: SignupDto): Promise<void> {
    return this._authService.signup(signupDto);
  }

  @Post('/signin')
  @UsePipes(ValidationPipe)
  signin(@Body() signinDto: SigninDto): Promise<LoggedInDto> {
    return this._authService.signin(signinDto);
  }

  @HttpCode(204)
  @Post('/changepassword')
  //@UseGuards(AuthGuard(), RoleGuard)
  changepassword(@Body() changepasswordDto: ChangepasswordDto): Promise<void> {
    return this._authService.updatepassword(changepasswordDto);
  }
}
