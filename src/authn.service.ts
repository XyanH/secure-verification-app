import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthnService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async register(user: User): Promise<User> {
    console.log('User before save:', user);
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
    console.log('User after hashing password:', user);
    return this.userRepository.save(user);
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({ email });
  }
}
