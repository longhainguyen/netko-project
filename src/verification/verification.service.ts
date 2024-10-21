import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { MoreThan, Repository } from 'typeorm';
import { Verification } from './entities/verification.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { generateOtp } from 'src/utils/generate-verification-token';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class VerificationService {
  private readonly minRequestIntervalMinutes = 1;
  private readonly tokenExpirationMinutes = 1;
  constructor(
    @InjectRepository(Verification)
    private readonly tokenRepository: Repository<Verification>,
  ) {}

  async generateOtp(user: User, size = 6): Promise<string> {
    const now = new Date();

    const recentToken = await this.tokenRepository.findOne({
      where: {
        createdAt: MoreThan(
          new Date(now.getTime() - this.minRequestIntervalMinutes * 60 * 1000),
        ),
        user: {
          id: user.id,
        },
      },
    });

    if (recentToken) {
      throw new UnprocessableEntityException(
        'Please wait a minute before request a new token',
      );
    }

    const otp = generateOtp(size);
    const hashedToken = await bcrypt.hash(otp, await bcrypt.genSalt());

    const tokenEntity = this.tokenRepository.create({
      user: user,
      token: hashedToken,
      expiresAt: new Date(
        now.getTime() + this.tokenExpirationMinutes * 60 * 1000,
      ),
    });

    await this.tokenRepository.save(tokenEntity);

    return otp;
  }

  async validateOtp(user: User, token: string): Promise<boolean> {
    const validToken = await this.tokenRepository.findOne({
      where: {
        expiresAt: MoreThan(new Date()),
        user: {
          id: user.id,
        },
      },
    });

    if (validToken && (await bcrypt.compare(token, validToken.token))) {
      await this.tokenRepository.remove(validToken);

      return true;
    } else {
      return false;
    }
  }
}
