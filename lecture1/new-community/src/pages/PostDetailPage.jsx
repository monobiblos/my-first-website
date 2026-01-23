import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Header from '../components/common/Header';
import { supabase } from '../lib/supabase';

/**
 * PostDetailPage 컴포넌트
 *
 * 게시물 상세 페이지 - 게시물 내용, 좋아요, 댓글
 */
function PostDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likedComments, setLikedComments] = useState({});
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(storedUser));
  }, [navigate]);

  useEffect(() => {
    if (user) {
      fetchPost();
      fetchComments();
      checkPostLiked();
    }
  }, [id, user]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (err) {
      console.error('Error fetching post:', err);
      navigate('/posts');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setComments(data || []);

      if (user && data) {
        const commentIds = data.map(c => c.id);
        const { data: likes } = await supabase
          .from('comment_likes')
          .select('comment_id')
          .eq('user_id', user.id)
          .in('comment_id', commentIds);

        const likedMap = {};
        (likes || []).forEach(like => {
          likedMap[like.comment_id] = true;
        });
        setLikedComments(likedMap);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const checkPostLiked = async () => {
    if (!user) return;
    try {
      const { data } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', id)
        .eq('user_id', user.id)
        .single();

      setIsLiked(!!data);
    } catch (err) {
      setIsLiked(false);
    }
  };

  const handlePostLike = async () => {
    if (!user) return;

    try {
      if (isLiked) {
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', id)
          .eq('user_id', user.id);

        await supabase
          .from('posts')
          .update({ likes_count: (post.likes_count || 1) - 1 })
          .eq('id', id);

        setPost(prev => ({ ...prev, likes_count: (prev.likes_count || 1) - 1 }));
        setIsLiked(false);
      } else {
        await supabase
          .from('post_likes')
          .insert([{ post_id: parseInt(id), user_id: user.id }]);

        await supabase
          .from('posts')
          .update({ likes_count: (post.likes_count || 0) + 1 })
          .eq('id', id);

        setPost(prev => ({ ...prev, likes_count: (prev.likes_count || 0) + 1 }));
        setIsLiked(true);
      }
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleCommentLike = async (commentId) => {
    if (!user) return;

    try {
      const isCommentLiked = likedComments[commentId];

      if (isCommentLiked) {
        await supabase
          .from('comment_likes')
          .delete()
          .eq('comment_id', commentId)
          .eq('user_id', user.id);

        const comment = comments.find(c => c.id === commentId);
        await supabase
          .from('comments')
          .update({ likes_count: (comment.likes_count || 1) - 1 })
          .eq('id', commentId);

        setComments(prev => prev.map(c =>
          c.id === commentId
            ? { ...c, likes_count: (c.likes_count || 1) - 1 }
            : c
        ));
        setLikedComments(prev => ({ ...prev, [commentId]: false }));
      } else {
        await supabase
          .from('comment_likes')
          .insert([{ comment_id: commentId, user_id: user.id }]);

        const comment = comments.find(c => c.id === commentId);
        await supabase
          .from('comments')
          .update({ likes_count: (comment.likes_count || 0) + 1 })
          .eq('id', commentId);

        setComments(prev => prev.map(c =>
          c.id === commentId
            ? { ...c, likes_count: (c.likes_count || 0) + 1 }
            : c
        ));
        setLikedComments(prev => ({ ...prev, [commentId]: true }));
      }
    } catch (err) {
      console.error('Error toggling comment like:', err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !user) return;

    try {
      const { error } = await supabase
        .from('comments')
        .insert([{
          content: newComment,
          author_id: user.id,
          author_name: user.username,
          post_id: parseInt(id),
        }]);

      if (error) throw error;

      setNewComment('');
      fetchComments();
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (isLoading) {
    return (
      <Box
        sx={{
          width: '100%',
          minHeight: '100vh',
          backgroundColor: '#0A0A0A',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress sx={{ color: '#D5BEE1' }} />
      </Box>
    );
  }

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
        {post && (
          <Box
            sx={{
              p: { xs: 3, md: 4 },
              backgroundColor: 'rgba(17, 17, 17, 0.6)',
              border: '1px solid rgba(213, 190, 225, 0.1)',
              borderRadius: '5px',
              mb: 3,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: '#fff',
                fontWeight: 500,
                mb: 2,
              }}
            >
              {post.title}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 3,
                pb: 2,
                borderBottom: '1px solid rgba(213, 190, 225, 0.1)',
              }}
            >
              <Typography variant="body2" sx={{ color: '#C9A868' }}>
                {post.author_name}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: 'rgba(255, 255, 255, 0.3)' }}
              >
                {formatDate(post.created_at)}
              </Typography>
            </Box>

            <Typography
              variant="body1"
              sx={{
                color: 'rgba(255, 255, 255, 0.8)',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.8,
                mb: 3,
              }}
            >
              {post.content}
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                pt: 2,
                borderTop: '1px solid rgba(213, 190, 225, 0.1)',
              }}
            >
              <IconButton
                onClick={handlePostLike}
                sx={{
                  color: isLiked ? '#D5BEE1' : 'rgba(255, 255, 255, 0.3)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    color: '#D5BEE1',
                    backgroundColor: 'rgba(213, 190, 225, 0.1)',
                  },
                }}
              >
                {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
              <Typography
                variant="body2"
                sx={{ color: 'rgba(255, 255, 255, 0.5)' }}
              >
                {post.likes_count || 0}
              </Typography>
            </Box>
          </Box>
        )}

        <Box
          sx={{
            p: { xs: 3, md: 4 },
            backgroundColor: 'rgba(17, 17, 17, 0.6)',
            border: '1px solid rgba(213, 190, 225, 0.1)',
            borderRadius: '5px',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: '#fff',
              fontWeight: 500,
              mb: 3,
            }}
          >
            댓글 {comments.length}개
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            <TextField
              fullWidth
              placeholder="댓글을 입력하세요"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
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
            <Button
              onClick={handleAddComment}
              sx={{
                px: 3,
                backgroundColor: 'rgba(213, 190, 225, 0.1)',
                border: '1px solid rgba(213, 190, 225, 0.3)',
                color: '#D5BEE1',
                whiteSpace: 'nowrap',
                '&:hover': {
                  backgroundColor: 'rgba(213, 190, 225, 0.2)',
                  borderColor: '#D5BEE1',
                },
              }}
            >
              등록
            </Button>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {comments.map((comment) => (
              <Box
                key={comment.id}
                sx={{
                  p: 2,
                  backgroundColor: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '5px',
                  border: '1px solid rgba(213, 190, 225, 0.05)',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    mb: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography
                      variant="body2"
                      sx={{ color: '#C9A868', fontWeight: 500 }}
                    >
                      {comment.author_name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{ color: 'rgba(255, 255, 255, 0.3)' }}
                    >
                      {formatDate(comment.created_at)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      onClick={() => handleCommentLike(comment.id)}
                      size="small"
                      sx={{
                        color: likedComments[comment.id]
                          ? '#D5BEE1'
                          : 'rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          color: '#D5BEE1',
                        },
                      }}
                    >
                      {likedComments[comment.id] ? (
                        <FavoriteIcon fontSize="small" />
                      ) : (
                        <FavoriteBorderIcon fontSize="small" />
                      )}
                    </IconButton>
                    <Typography
                      variant="caption"
                      sx={{ color: 'rgba(255, 255, 255, 0.4)' }}
                    >
                      {comment.likes_count || 0}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {comment.content}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}

export default PostDetailPage;
