import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Header from '../components/common/Header';
import { supabase } from '../lib/supabase';

/**
 * PostWritePage 컴포넌트
 *
 * 게시물 작성 페이지
 */
function PostWritePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }

    if (!content.trim()) {
      setError('내용을 입력해주세요.');
      return;
    }

    if (!user) {
      setError('로그인이 필요합니다.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { error: insertError } = await supabase
        .from('posts')
        .insert([{
          title,
          content,
          author_id: user.id,
          author_name: user.username,
        }]);

      if (insertError) throw insertError;

      navigate('/posts');
    } catch (err) {
      console.error('Error creating post:', err);
      setError('게시물 작성 중 오류가 발생했습니다.');
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
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
    '& .MuiInputLabel-root': {
      color: 'rgba(255, 255, 255, 0.5)',
      '&.Mui-focused': {
        color: '#D5BEE1',
      },
    },
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#0A0A0A',
      }}
    >
      <Header
        hasBackButton
        username={user?.username}
        onLogout={handleLogout}
      />

      <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
        <Box
          sx={{
            p: { xs: 3, md: 4 },
            backgroundColor: 'rgba(17, 17, 17, 0.6)',
            border: '1px solid rgba(213, 190, 225, 0.1)',
            borderRadius: '5px',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
            }}
          >
            <TextField
              fullWidth
              label="제목"
              placeholder="제목을 입력하세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={inputStyles}
            />

            <TextField
              fullWidth
              label="내용"
              placeholder="내용을 입력하세요"
              multiline
              rows={12}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              sx={{
                ...inputStyles,
                '& .MuiOutlinedInput-root': {
                  ...inputStyles['& .MuiOutlinedInput-root'],
                  alignItems: 'flex-start',
                },
              }}
            />

            {error && (
              <Alert
                severity="error"
                sx={{
                  backgroundColor: 'rgba(211, 47, 47, 0.1)',
                  color: '#f44336',
                  border: '1px solid rgba(211, 47, 47, 0.3)',
                }}
              >
                {error}
              </Alert>
            )}

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2,
              }}
            >
              <Button
                onClick={() => navigate(-1)}
                sx={{
                  px: 4,
                  color: 'rgba(255, 255, 255, 0.5)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  },
                }}
              >
                취소
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                sx={{
                  px: 4,
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
                {isLoading ? '업로드 중...' : '업로드'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default PostWritePage;
