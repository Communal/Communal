'use client';
import { Input } from '../../components/Input';
import Button from '../../components/Button';
import Link from 'next/link';
import { ChevronLeftIcon } from 'lucide-react';
import { useActionState } from 'react';
import { handleSignup } from '../api/auth';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const initialState = {
  email: process.env.NODE_ENV === 'development' ? 'test@example.com' : '',
  firstName: process.env.NODE_ENV === 'development' ? 'John' : '',
  lastName: process.env.NODE_ENV === 'development' ? 'Doe' : '',
  phone: process.env.NODE_ENV === 'development' ? '08012345678' : '',
  password: process.env.NODE_ENV === 'development' ? 'password123' : '',
  confirmPassword: process.env.NODE_ENV === 'development' ? 'password123' : '',
  error: '',
  success: '',
};

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(
    handleSignup,
    initialState
  );

  const [passwordStrength, setPasswordStrength] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (state?.success && state.success.includes('Redirecting')) {
      const timer = setTimeout(() => {
        router.push('/login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state?.success, router]);

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    if (password.length < 6) {
      setPasswordStrength('Password must be at least 6 characters');
    } else if (password.length < 8) {
      setPasswordStrength('Weak password');
    } else if (password.length < 10) {
      setPasswordStrength('Medium password');
    } else {
      setPasswordStrength('Strong password');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    // intentionally left blank — server-side validation handles matching
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 11) {
      value = value.slice(0, 11);
    }
    e.target.value = value;
  };

  const handlePhoneKeyPress = (e) => {
    const allowedKeys = [
      '0','1','2','3','4','5','6','7','8','9',
      'Backspace','Delete','Tab','Enter',
      'ArrowLeft','ArrowRight','ArrowUp','ArrowDown',
    ];
    if (!allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className='flex flex-col justify-center bg-background px-4 py-8'>
      <Link
        href='/'
        className='bg-foreground flex text-background px-3 rounded-lg w-fit gap-1 py-2 text-sm'
      >
        <ChevronLeftIcon className='size-5' />
        <span> Home</span>
      </Link>

      <div className='flex flex-col items-center mt-20'>
        <h1 className='text-3xl font-bold text-foreground mb-2'>
          Communal Shop
        </h1>
        <p className='text-lg text-foreground mb-6'>
          Please sign up to create a new account
        </p>

        {state?.error && (
          <div className='w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
            {state.error}
          </div>
        )}

        {state?.success && (
          <div className='w-full bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4'>
            {state.success}
          </div>
        )}

        <form className='w-full flex flex-col gap-4' action={formAction}>
          <Input
            type='email'
            name='email'
            placeholder='Email'
            defaultValue={state?.email || ''}
            required
          />
          <Input
            type='text'
            name='firstName'
            placeholder='First Name'
            defaultValue={state?.firstName || ''}
            required
          />
          <Input
            type='text'
            name='lastName'
            placeholder='Last Name'
            defaultValue={state?.lastName || ''}
            required
          />
          <div className='relative'>
            <Input
              type='tel'
              name='phone'
              placeholder='Phone Number (11 digits)'
              defaultValue={state?.phone || ''}
              onChange={handlePhoneChange}
              onKeyDown={handlePhoneKeyPress}
              maxLength={11}
              pattern='[0-9]{11}'
              required
            />
            <p className='text-xs text-gray-500 mt-1'>
              Enter 11-digit Nigerian phone number (e.g., 08012345678)
            </p>
          </div>
          <div className='relative'>
            <Input
              type='password'
              name='password'
              placeholder='Password'
              defaultValue={state?.password || ''}
              onChange={handlePasswordChange}
              required
            />
            {passwordStrength && (
              <p
                className={`text-xs mt-1 ${
                  passwordStrength.includes('Weak')
                    ? 'text-red-500'
                    : passwordStrength.includes('Medium')
                    ? 'text-yellow-500'
                    : passwordStrength.includes('Strong')
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                {passwordStrength}
              </p>
            )}
          </div>
          <div className='relative'>
            <Input
              type='password'
              name='confirmPassword'
              placeholder='Confirm Password'
              defaultValue={state?.confirmPassword || ''}
              onChange={handleConfirmPasswordChange}
              required
            />
          </div>
          <Button
            type='submit'
            className='button w-full mt-6'
            disabled={pending}
          >
            {pending ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <p className='mt-8 text-center text-gray-700'>
          Already have an account?{' '}
          <Link
            href='/login'
            className='text-foreground underline font-semibold'
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}