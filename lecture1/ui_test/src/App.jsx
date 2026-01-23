import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

/**
 * App 컴포넌트
 * 16개 UI 섹션을 순차적으로 추가할 수 있는 기본 레이아웃
 */
function App() {
  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        py: { xs: 2, md: 4 }
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            textAlign: 'center',
            mb: 4,
            fontSize: { xs: '1.5rem', md: '2rem' }
          }}
        >
          UI Test Project
        </Typography>

        {/* 섹션들을 여기에 순차적으로 추가 */}
        {/* <Section01 /> */}
        {/* <Section02 /> */}
        {/* ... */}

      </Container>
    </Box>
  );
}

export default App;
