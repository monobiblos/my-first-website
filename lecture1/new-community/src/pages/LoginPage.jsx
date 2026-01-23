import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import SpaceBackground from '../components/ui/SpaceBackground';
import FingerprintButton from '../components/ui/FingerprintButton';
import { supabase } from '../lib/supabase';

/**
 * LoginPage 컴포넌트
 *
 * 로그인 페이지 - 우주 배경과 지문인식 스타일 버튼
 */
function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { data, error: dbError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (dbError || !data) {
        setError('아이디 또는 비밀번호가 일치하지 않습니다.');
        setIsLoading(false);
        return;
      }

      localStorage.setItem('user', JSON.stringify({
        id: data.id,
        username: data.username,
      }));

      navigate('/posts');
    } catch (err) {
      setError('로그인 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
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
            gap: 4,
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
              백야
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontWeight: 300,
                letterSpacing: '0.1em',
              }}
            >
              새벽의 끝에
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
              sx={{
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
              }}
            />
            <TextField
              fullWidth
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              sx={{
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
              }}
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

          <Box sx={{ my: 2 }}>
            <FingerprintButton onClick={handleLogin} isLoading={isLoading} />
          </Box>

          <Typography
            component={Link}
            to="/register"
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
            기억나지 않으신가요?
          </Typography>
        </Box>
      </Box>
    </SpaceBackground>
  );
}

export default LoginPage;
