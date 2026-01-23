import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

/**
 * Header 컴포넌트
 *
 * 공통 상단 네비게이션
 *
 * Props:
 * @param {boolean} hasBackButton - 뒤로가기 버튼 표시 여부 [Optional, 기본값: false]
 * @param {string} username - 로그인한 사용자명 [Optional]
 * @param {function} onLogout - 로그아웃 핸들러 [Optional]
 * @param {boolean} hasWriteButton - 글쓰기 버튼 표시 여부 [Optional, 기본값: false]
 *
 * Example usage:
 * <Header username="user1" onLogout={handleLogout} hasWriteButton />
 */
function Header({ hasBackButton = false, username, onLogout, hasWriteButton = false }) {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        width: '100%',
        py: 2,
        px: { xs: 2, md: 4 },
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(17, 17, 17, 0.8)',
        borderBottom: '1px solid rgba(213, 190, 225, 0.1)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {hasBackButton && (
          <IconButton
            onClick={() => navigate(-1)}
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': {
                color: '#D5BEE1',
                backgroundColor: 'rgba(213, 190, 225, 0.1)',
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}
        <Typography
          variant="h6"
          sx={{
            color: '#D5BEE1',
            fontWeight: 300,
            letterSpacing: '0.1em',
            cursor: 'pointer',
          }}
          onClick={() => navigate('/posts')}
        >
          백야
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {username && (
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            <Box
              component="span"
              sx={{ color: '#C9A868' }}
            >
              {username}
            </Box>
            님 환영합니다
          </Typography>
        )}
        {hasWriteButton && (
          <Button
            onClick={() => navigate('/write')}
            sx={{
              color: '#D5BEE1',
              borderColor: 'rgba(213, 190, 225, 0.3)',
              border: '1px solid',
              '&:hover': {
                borderColor: '#D5BEE1',
                backgroundColor: 'rgba(213, 190, 225, 0.1)',
              },
            }}
          >
            글쓰기
          </Button>
        )}
        {onLogout && (
          <Button
            onClick={onLogout}
            sx={{
              color: 'rgba(255, 255, 255, 0.5)',
              '&:hover': {
                color: '#C9A868',
                backgroundColor: 'rgba(201, 168, 104, 0.1)',
              },
            }}
          >
            로그아웃
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default Header;
