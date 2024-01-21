import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateAccountDto } from './dtos/create-account.dto';
import * as bcrypt from 'bcrypt';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { EditAccountDto } from './dtos/edit-account.dto';
import { AccountsRepository } from './accounts.repository';
import { v4 as uuid } from 'uuid';
import * as crypto from 'crypto';
import { Role } from './entities/role.enum';

@Injectable()
export class AccountsService {
  constructor(private readonly accountsRepository: AccountsRepository) {}

  async findOneById(id: string) {
    const account = await this.accountsRepository.findOne({ account_id: id });
    return account;
  }
  async findOneByEmail(email: string) {
    const account = await this.accountsRepository.findOne({ email });
    return account;
  }

  async create({ email, password }: CreateAccountDto) {
    const exist = await this.accountsRepository.exists({ email });
    console.log(exist);
    if (exist) {
      throw new BadRequestException('이미 가입된 이메일입니다.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return this.accountsRepository.create({
      account_id: uuid(),
      email,
      password: hashedPassword,
      profile_url: '',
      name: crypto.randomBytes(10).toString('hex'),
      role: Role.User,
    });
  }

  async changePassword(account_id: string, { password }: ChangePasswordDto) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedAccount = await this.accountsRepository.findOneAndUpdate(
      { account_id },
      { password: hashedPassword },
    );

    if (!updatedAccount) {
      throw new BadRequestException('계정이 존재하지 않습니다.');
    }

    return updatedAccount;
  }

  async update(account_id: string, editAccountDto: EditAccountDto) {
    const updatedAccount = await this.accountsRepository.findOneAndUpdate(
      { account_id },
      editAccountDto,
    );

    if (!updatedAccount) {
      throw new BadRequestException('계정이 존재하지 않습니다.');
    }
    return updatedAccount;
  }
}
