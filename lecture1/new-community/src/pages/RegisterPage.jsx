import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import SpaceBackground from '../components/ui/SpaceBackground';
import { supabase } from '../lib/supabase';

/**
 * RegisterPage 컴포넌트
 *
 * 회원가입 페이지
 */
function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!username.trim() || !password.trim()) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (password.length < 4) {
      setError('비밀번호는 4자 이상이어야 합니다.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('username', username)
        .single();

      if (existingUser) {
        setError('이미 사용 중인 아이디입니다.');
        setIsLoading(false);
        return;
      }

      const { error: insertError } = await supabase
        .from('users')
        .insert([{ username, password }]);

      if (insertError) {
        setError('회원가입 중 오류가 발생했습니다.');
        setIsLoading(false);
        return;
      }

      navigate('/login');
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleRegister();
    }
  };

  const inputStyles = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgba(17, 17, 17, 0.6)',
      '& fieldset': {
        borderColor: 'rgba(213, 190, 225, 0.2)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(213, 190, 225, 0.4)',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#D5BEE1',
      },
    },
    '& .MuiInputBase-input': {
      color: '#fff',
      '&::placeholder': {
        color: 'rgba(255, 255, 255, 0.4)',
        opacity: 1,
      },
    },
  };

  return (
    <SpaceBackground>
      <Box
        sx={{
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: { xs: 2, md: 4 },
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: 400,
            px: { xs: 3, md: 4 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography
              variant="h4"
              sx={{
                color: '#D5BEE1',
                fontWeight: 300,
                letterSpacing: '0.15em',
                mb: 1,
              }}
            >
              회원가입
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontWeight: 300,
              }}
            >
              새로운 여정을 시작하세요
            </Typography>
          </Box>

          <Box
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              placeholder="아이디"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={inputStyles}
            />
            <TextField
              fullWidth
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={inputStyles}
            />
            <TextField
              fullWidth
              type="password"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={inputStyles}
            />
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{
                width: '100%',
                backgroundColor: 'rgba(211, 47, 47, 0.1)',
                color: '#f44336',
                border: '1px solid rgba(211, 47, 47, 0.3)',
              }}
            >
              {error}
            </Alert>
          )}

          <Button
            fullWidth
            onClick={handleRegister}
            disabled={isLoading}
            sx={{
              py: 1.5,
              backgroundColor: 'rgba(213, 190, 225, 0.1)',
              border: '1px solid rgba(213, 190, 225, 0.3)',
              color: '#D5BEE1',
              '&:hover': {
                backgroundColor: 'rgba(213, 190, 225, 0.2)',
                borderColor: '#D5BEE1',
              },
              '&:disabled': {
                color: 'rgba(213, 190, 225, 0.3)',
              },
            }}
          >
            {isLoading ? '처리 중...' : '회원가입'}
          </Button>

          <Typography
            component={Link}
            to="/login"
            sx={{
              color: 'rgba(255, 255, 255, 0.4)',
              fontSize: '0.8rem',
              textDecoration: 'none',
              transition: 'color 0.3s ease',
              '&:hover': {
                color: '#C9A868',
              },
            }}
          >
            이미 계정이 있으신가요?
          </Typography>
        </Box>
      </Box>
    </SpaceBackground>
  );
}

export default RegisterPage;
