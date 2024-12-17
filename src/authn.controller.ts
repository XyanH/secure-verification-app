import { Controller, Post, Body } from '@nestjs/common';
import { AuthnService } from './authn.service';
import { User } from './user/user.entity';
import * as bcrypt from 'bcrypt';

@Controller('authn')
export class AuthnController {
  constructor(private readonly authnService: AuthnService) {}

  @Post('register')
  async register(
    @Body()
    body: {
      email: string;
      password: string;
      voiceData?: string;
      faceData?: string;
    },
  ) {
    try {
      const existingUser = await this.authnService.findByEmail(body.email);
      if (existingUser) {
        return { success: false, message: 'Email already registered' };
      }

      const user = new User();
      user.email = body.email;
      user.password = body.password;
      user.voiceData = body.voiceData;
      user.faceData = body.faceData;
      await this.authnService.register(user);
      return { success: true, message: 'User registered successfully' };
    } catch (error) {
      console.error('Error during registration:', error);
      return { success: false, message: 'Error during sign-up' };
    }
  }

  @Post('login')
  async login(
    @Body()
    body: {
      email: string;
      password: string;
      voiceData: string;
      faceData: string;
    },
  ) {
    const user = await this.authnService.findByEmail(body.email);
    console.log(user);
    if (!user) {
      return { success: false, message: 'User not found' };
    }

    //check password
    const isValidPassword = await bcrypt.compare(body.password, user.password);
    if (!isValidPassword) {
      return { success: false, message: 'Invalid password' };
    }

    if (body.faceData !== user.faceData) {
      return { success: false, message: 'Face verification failed' };
    }

    if (body.voiceData !== user.voiceData) {
      return { success: false, message: 'Voice verification failed' };
    }

    return { success: true, message: 'Login successful' };
  }
}
