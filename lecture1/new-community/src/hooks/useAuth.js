import { useState, useEffect } from 'react';

/**
 * useAuth 커스텀 훅
 *
 * 로컬 스토리지 기반 사용자 인증 상태 관리
 *
 * @returns {object} user - 현재 로그인한 사용자 정보
 * @returns {function} login - 로그인 처리 함수
 * @returns {function} logout - 로그아웃 처리 함수
 * @returns {boolean} isAuthenticated - 로그인 여부
 */
function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return {
    user,
    login,
    logout,
    isAuthenticated: !!user,
  };
}

export default useAuth;
