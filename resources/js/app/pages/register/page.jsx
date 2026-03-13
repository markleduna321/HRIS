import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import { UserIcon, EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function Register() {
  const { data, setData, post, processing, errors } = useForm({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    terms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [firstNameFocused, setFirstNameFocused] = useState(false);
  const [lastNameFocused, setLastNameFocused] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [confirmPasswordFocused, setConfirmPasswordFocused] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    post('/register');
  };

  return (
    <>
      <Head title="Sign Up" />
      <div className="flex min-h-screen items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">
              Create your account
            </h2>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {/* First Name */}
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                id="first_name"
                name="first_name"
                type="text"
                value={data.first_name}
                onChange={(e) => setData('first_name', e.target.value)}
                onFocus={() => setFirstNameFocused(true)}
                onBlur={() => setFirstNameFocused(false)}
                required
                autoComplete="given-name"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <label
                htmlFor="first_name"
                className={`absolute left-10 bg-white px-1 pointer-events-none transition-all duration-200 ${
                  firstNameFocused || data.first_name
                    ? 'top-0 text-xs text-blue-600 transform -translate-y-1/2'
                    : 'top-1/2 text-sm text-gray-400 transform -translate-y-1/2'
                }`}
              >
                First Name
              </label>
              {errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>}
            </div>

            {/* Last Name */}
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                id="last_name"
                name="last_name"
                type="text"
                value={data.last_name}
                onChange={(e) => setData('last_name', e.target.value)}
                onFocus={() => setLastNameFocused(true)}
                onBlur={() => setLastNameFocused(false)}
                required
                autoComplete="family-name"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <label
                htmlFor="last_name"
                className={`absolute left-10 bg-white px-1 pointer-events-none transition-all duration-200 ${
                  lastNameFocused || data.last_name
                    ? 'top-0 text-xs text-blue-600 transform -translate-y-1/2'
                    : 'top-1/2 text-sm text-gray-400 transform -translate-y-1/2'
                }`}
              >
                Last Name
              </label>
              {errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>}
            </div>

            {/* Email Address */}
            <div className="relative">
              <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                id="email"
                name="email"
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                onFocus={() => setEmailFocused(true)}
                onBlur={() => setEmailFocused(false)}
                required
                autoComplete="email"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <label
                htmlFor="email"
                className={`absolute left-10 bg-white px-1 pointer-events-none transition-all duration-200 ${
                  emailFocused || data.email
                    ? 'top-0 text-xs text-blue-600 transform -translate-y-1/2'
                    : 'top-1/2 text-sm text-gray-400 transform -translate-y-1/2'
                }`}
              >
                Email Address
              </label>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={data.password}
                onChange={(e) => setData('password', e.target.value)}
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                required
                autoComplete="new-password"
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <label
                htmlFor="password"
                className={`absolute left-10 bg-white px-1 pointer-events-none transition-all duration-200 ${
                  passwordFocused || data.password
                    ? 'top-0 text-xs text-blue-600 transform -translate-y-1/2'
                    : 'top-1/2 text-sm text-gray-400 transform -translate-y-1/2'
                }`}
              >
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <LockClosedIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
              <input
                id="password_confirmation"
                name="password_confirmation"
                type={showConfirmPassword ? 'text' : 'password'}
                value={data.password_confirmation}
                onChange={(e) => setData('password_confirmation', e.target.value)}
                onFocus={() => setConfirmPasswordFocused(true)}
                onBlur={() => setConfirmPasswordFocused(false)}
                required
                autoComplete="new-password"
                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <label
                htmlFor="password_confirmation"
                className={`absolute left-10 bg-white px-1 pointer-events-none transition-all duration-200 ${
                  confirmPasswordFocused || data.password_confirmation
                    ? 'top-0 text-xs text-blue-600 transform -translate-y-1/2'
                    : 'top-1/2 text-sm text-gray-400 transform -translate-y-1/2'
                }`}
              >
                Confirm Password
              </label>
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
              {errors.password_confirmation && <p className="mt-1 text-sm text-red-600">{errors.password_confirmation}</p>}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={data.terms}
                onChange={(e) => setData('terms', e.target.checked)}
                required
                className="h-4 w-4 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                I agree to the{' '}
                <Link href="#" className="text-blue-600 hover:text-blue-500">
                  Terms and Conditions
                </Link>
              </label>
            </div>
            {errors.terms && <p className="mt-1 text-sm text-red-600">{errors.terms}</p>}

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={processing}
                className="flex w-full justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {processing ? 'Creating account...' : 'Create Account'}
              </button>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
