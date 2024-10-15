import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

const configService = new ConfigService();

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const user = await this.userService.findOne(username);

    const isMatch = await bcrypt.compare(pass, user.password);
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
      username: user.username,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: configService.getOrThrow('JWT_ACCESS_KEY'),
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: configService.getOrThrow('JWT_REFRESH_KEY'),
      expiresIn: '7d',
    });

    await this.userService.updateUser(
      {
        refreshToken: refreshToken,
      },
      user.id,
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refresh(
    refreshToken: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: configService.getOrThrow('JWT_REFRESH_KEY'),
      });

      const user = await this.userService.findOneById(+payload.sub);

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException();
      }

      const newAccessToken = await this.jwtService.signAsync(
        { sub: user.id, username: user.username, role: user.role },
        {
          secret: configService.getOrThrow('JWT_ACCESS_KEY'),
          expiresIn: '15m',
        },
      );

      const newRefreshToken = await this.jwtService.signAsync(
        { sub: user.id, username: user.username, role: user.role },
        {
          secret: configService.getOrThrow('JWT_REFRESH_KEY'),
          expiresIn: '7d',
        },
      );

      await this.userService.updateUser(
        { refreshToken: newRefreshToken },
        user.id,
      );

      return {
        access_token: newAccessToken,
        refresh_token: newRefreshToken,
      };
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
