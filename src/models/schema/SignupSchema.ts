import { isValidPhoneNumber } from 'react-phone-number-input';
import { z } from 'zod';

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

export const SignupSchema = z
  .object({
    firstName: z.string().min(2, 'Please enter your first name'),
    lastName: z.string().min(2, 'Please enter your last name'),
    email: z.string().email('Please enter a valid email'),
    phoneNumber: z.string().refine((val) => isValidPhoneNumber(val), {
      message: 'Please enter a valid phone number',
    }),
    password: z.string().min(8, {
      message: 'Password must contain at least 8 characters, 1 number, and a special character',
    }),
  })
  .refine((data) => passwordRegex.test(data.password), {
    path: ['password'],
    message: 'Password must contain at least 8 characters, 1 number, 1 alphabet and a special character',
  });
