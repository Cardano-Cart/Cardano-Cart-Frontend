'use client';

import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Checkbox, FormControl, FormLabel, Input, Link, Stack, Typography } from '@mui/joy';
import { UserContext } from '../../../utils/UserContext';
import SignInAnimation from '../_components/SignInAnimation';
import GoogleLoginButton from '../_components/GoogleLoginButton';
import { Auth } from '../../../utils/_auth';

const BASE_URL = 'https://charming-ninnetta-knust-028ea081.koyeb.app/api/v1';
const auth = new Auth();

export default function SignInForm() {
  const router = useRouter();
  const { setUser } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setLoading] = useState(false);

  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await auth.Credentials({ email, password }, `${BASE_URL}/users/login/`);
      localStorage.setItem('accessToken', user.access);
      setUser(user);
      router.push('/');
    } catch (error) {
      alert('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleEmailSignIn}>
      {isLoading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            zIndex: 9999,
          }}
        >
          <SignInAnimation />
          <Typography sx={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>Loading...</Typography>
        </Box>
      )}

      <FormControl required>
        <FormLabel>Email</FormLabel>
        <Input type="email" name="email" onChange={(e) => setEmail(e.target.value)} />
      </FormControl>
      <FormControl required>
        <FormLabel>Password</FormLabel>
        <Input type="password" name="password" onChange={(e) => setPassword(e.target.value)} />
      </FormControl>
      <Stack sx={{ gap: 4, mt: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Checkbox size="sm" label="Remember me" name="persistent" />
          <Link level="title-sm" href="#">Forgot your password?</Link>
        </Box>
        <Button type="submit" fullWidth disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign in'}
        </Button>
      </Stack>
      <GoogleLoginButton />
    </form>
  );
}
