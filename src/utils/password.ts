import bcrypt from 'bcrypt';
import { config } from '@/config/env';

export class PasswordUtils {
  static async hash(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, config.security.bcryptSaltRounds);
    } catch (error) {
      throw new Error('Failed to hash password');
    }
  }

  static async compare(password: string, hash: string): Promise<boolean> {
    try {
      console.log({ password, hash });
      return await bcrypt.compare(password, hash);
    } catch (error) {
      throw new Error('Failed to compare password');
    }
  }

  static validateStrength(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    if (password.length > 100) {
      errors.push('Password must be less than 100 characters long');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static generate(length: number = 12): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';

    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    return password;
  }
}
