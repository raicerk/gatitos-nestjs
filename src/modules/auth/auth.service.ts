import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { LoggedInDto, SigninDto, SignupDto } from './dto';
import { User } from '../user/user.entity';
import { compare, genSalt, hash } from 'bcryptjs';
import { IJwtPayload } from './jwt-payload.interface';
import { RoleType } from '../role/roletype.enum';
import { plainToClass } from 'class-transformer';
import { UserStatus } from '../user/userstatus.enum';
import { ChangepasswordDto } from './dto/changepassword.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthRepository)
    private readonly _authRepository: AuthRepository,
    private readonly _jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto): Promise<void> {
    const { username, email } = signupDto;
    const userExists = await this._authRepository.findOne({
      where: [{ username }, { email }],
    });

    if (userExists) {
      throw new ConflictException('Username or email already exists');
    }

    return this._authRepository.signup(signupDto);
  }

  async signin(signinDto: SigninDto): Promise<LoggedInDto> {
    const { username, password } = signinDto;

    const user: User = await this._authRepository.findOne({
      where: {
        username,
      },
    });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const isMatch = await compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: IJwtPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
      roles: user.roles.map((r) => r.name as RoleType),
    };

    const token = this._jwtService.sign(payload);
    return plainToClass(LoggedInDto, { token });
  }

  async updatepassword(changepasswordDto: ChangepasswordDto): Promise<void> {
    const { userId, password } = changepasswordDto;
    const user: User = await this._authRepository.findOne(userId, {
      where: {
        status: UserStatus.ACTIVE,
      },
    });
    if (!user) {
      throw new NotFoundException('User does not exist');
    }

    const salt = await genSalt(10);
    const newPassword = await hash(password, salt);

    await this._authRepository.update(userId, {
      password: newPassword,
    });
  }
}
