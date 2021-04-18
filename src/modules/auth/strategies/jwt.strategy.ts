import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Configuration } from 'src/config/config.keys';
import { ConfigService } from 'src/config/config.service';
import { UserStatus } from 'src/modules/user/userstatus.enum';
import { AuthRepository } from '../auth.repository';
import { IJwtPayload } from '../jwt-payload.interface';

export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly _configService: ConfigService,
    @InjectRepository(AuthRepository)
    private readonly _authRepository: AuthRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _configService.get(Configuration.JWT_SECRET),
    });
  }

  async validate(payload: IJwtPayload) {
    const { username } = payload;
    const user = await this._authRepository.findOne({
      where: {
        username,
        status: UserStatus.ACTIVE,
      },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return payload;
  }
}