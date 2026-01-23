import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import CircularProgress from '@mui/material/CircularProgress';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import Header from '../components/common/Header';
import { supabase } from '../lib/supabase';

/**
 * PostListPage 컴포넌트
 *
 * 게시물 목록 페이지 - 10개씩 페이지네이션
 */
function PostListPage() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [user, setUser] = useState(null);

  const postsPerPage = 10;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const { count } = await supabase
        .from('posts')
        .select('*', { count: 'exact', head: true });

      setTotalPages(Math.ceil((count || 0) / postsPerPage));

      const from = (currentPage - 1) * postsPerPage;
      const to = from + postsPerPage - 1;

      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      const postsWithComments = await Promise.all(
        (data || []).map(async (post) => {
          const { count: commentCount } = await supabase
            .from('comments')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id);

          return { ...post, comment_count: commentCount || 0 };
        })
      );

      setPosts(postsWithComments);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  const truncateContent = (content, maxLength = 80) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
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
        username={user?.username}
        onLogout={handleLogout}
        hasWriteButton
      />

      <Container maxWidth="md" sx={{ py: { xs: 2, md: 4 } }}>
        {isLoading ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '50vh',
            }}
          >
            <CircularProgress sx={{ color: '#D5BEE1' }} />
          </Box>
        ) : posts.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '50vh',
              gap: 2,
            }}
          >
            <Typography
              sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
            >
              아직 게시물이 없습니다
            </Typography>
            <Typography
              sx={{
                color: '#D5BEE1',
                cursor: 'pointer',
                '&:hover': { color: '#C9A868' },
              }}
              onClick={() => navigate('/write')}
            >
              첫 번째 글을 작성해보세요
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {posts.map((post) => (
              <Box
                key={post.id}
                onClick={() => navigate(`/posts/${post.id}`)}
                sx={{
                  p: { xs: 2, md: 3 },
                  backgroundColor: 'rgba(17, 17, 17, 0.6)',
                  border: '1px solid rgba(213, 190, 225, 0.1)',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(17, 17, 17, 0.8)',
                    borderColor: 'rgba(213, 190, 225, 0.3)',
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: '#fff',
                    fontWeight: 500,
                    mb: 1,
                    fontSize: { xs: '1rem', md: '1.1rem' },
                  }}
                >
                  {post.title}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.5)',
                    mb: 2,
                    lineHeight: 1.5,
                  }}
                >
                  {truncateContent(post.content)}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography
                      variant="caption"
                      sx={{ color: '#C9A868' }}
                    >
                      {post.author_name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'rgba(255, 255, 255, 0.3)' }}
                    >
                      {formatDate(post.created_at)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <FavoriteIcon
                        sx={{
                          fontSize: '0.9rem',
                          color: 'rgba(213, 190, 225, 0.5)',
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                      >
                        {post.likes_count || 0}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <ChatBubbleOutlineIcon
                        sx={{
                          fontSize: '0.9rem',
                          color: 'rgba(213, 190, 225, 0.5)',
                        }}
                      />
                      <Typography
                        variant="caption"
                        sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
                      >
                        {post.comment_count || 0}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))}

            {totalPages > 1 && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  mt: 4,
                }}
              >
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  sx={{
                    '& .MuiPaginationItem-root': {
                      color: 'rgba(255, 255, 255, 0.5)',
                      borderColor: 'rgba(213, 190, 225, 0.2)',
                      '&:hover': {
                        backgroundColor: 'rgba(213, 190, 225, 0.1)',
                      },
                      '&.Mui-selected': {
                        backgroundColor: 'rgba(213, 190, 225, 0.2)',
                        color: '#D5BEE1',
                        '&:hover': {
                          backgroundColor: 'rgba(213, 190, 225, 0.3)',
                        },
                      },
                    },
                  }}
                />
              </Box>
            )}
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default PostListPage;
