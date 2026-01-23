import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * FingerprintButton 컴포넌트
 *
 * 지문인식 스타일의 로그인 버튼
 *
 * Props:
 * @param {function} onClick - 클릭 핸들러 [Required]
 * @param {boolean} isLoading - 로딩 상태 [Optional, 기본값: false]
 * @param {string} label - 버튼 텍스트 [Optional, 기본값: '로그인']
 *
 * Example usage:
 * <FingerprintButton onClick={handleLogin} isLoading={loading} />
 */
function FingerprintButton({ onClick, isLoading = false, label = '로그인' }) {
  const [isPressed, setIsPressed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);

  return (
    <Box
      onClick={!isLoading ? onClick : undefined}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        setIsPressed(false);
        setIsHovered(false);
      }}
      onMouseEnter={() => setIsHovered(true)}
      sx={{
        position: 'relative',
        width: 120,
        height: 120,
        borderRadius: '50%',
        cursor: isLoading ? 'wait' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -3,
          left: -3,
          right: -3,
          bottom: -3,
          borderRadius: '50%',
          border: '2px solid',
          borderColor: isPressed
            ? '#C9A868'
            : isHovered
              ? '#D5BEE1'
              : 'rgba(213, 190, 225, 0.3)',
          transition: 'all 0.3s ease',
          animation: isPressed ? 'pulse 0.5s ease-in-out' : 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: -8,
          left: -8,
          right: -8,
          bottom: -8,
          borderRadius: '50%',
          border: '1px solid',
          borderColor: isPressed
            ? 'rgba(201, 168, 104, 0.5)'
            : 'rgba(213, 190, 225, 0.1)',
          transition: 'all 0.3s ease',
        },
        '@keyframes pulse': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
      }}
    >
      <Box
        sx={{
          width: 100,
          height: 100,
          borderRadius: '50%',
          backgroundColor: 'rgba(17, 17, 17, 0.8)',
          border: '1px solid',
          borderColor: isPressed
            ? '#C9A868'
            : isHovered
              ? '#D5BEE1'
              : 'rgba(213, 190, 225, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          transition: 'all 0.3s ease',
          boxShadow: isPressed
            ? '0 0 20px rgba(201, 168, 104, 0.3)'
            : isHovered
              ? '0 0 15px rgba(213, 190, 225, 0.2)'
              : 'none',
        }}
      >
        {isLoading ? (
          <CircularProgress size={30} sx={{ color: '#D5BEE1' }} />
        ) : (
          <>
            <Box
              sx={{
                width: 40,
                height: 50,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '3px',
              }}
            >
              {[...Array(6)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    width: 30 - i * 4,
                    height: 2,
                    borderRadius: 1,
                    backgroundColor: isPressed
                      ? '#C9A868'
                      : isHovered
                        ? '#D5BEE1'
                        : 'rgba(213, 190, 225, 0.5)',
                    transition: 'all 0.3s ease',
                    transitionDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </Box>
            <Typography
              variant="caption"
              sx={{
                color: isPressed
                  ? '#C9A868'
                  : isHovered
                    ? '#D5BEE1'
                    : 'rgba(255, 255, 255, 0.6)',
                mt: 0.5,
                fontSize: '0.65rem',
                letterSpacing: '0.1em',
                transition: 'all 0.3s ease',
              }}
            >
              {label}
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
}

export default FingerprintButton;
