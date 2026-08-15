import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const role = searchParams.get('role');
    const isNew = searchParams.get('isNew') === 'true';

    if (token && role) {
      loginWithToken(token, isNew).then((result) => {
        if (result.success) {
          const userRole = result.user?.role?.toUpperCase();
          if (userRole === 'ADMIN') {
            navigate('/admin/dashboard', { replace: true });
          } else if (userRole === 'OWNER') {
            navigate('/owner/dashboard', { replace: true });
          } else {
            navigate('/customer/dashboard', { replace: true });
          }
        } else {
          navigate('/login?error=oauth_failed', { replace: true });
        }
      });
    } else {
      navigate('/login?error=invalid_token', { replace: true });
    }
  }, [searchParams, navigate, loginWithToken]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC]">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="mx-auto h-10 w-10 rounded-full border-4 border-[#CCCCFF] border-t-[#5D5DEB]"
        />
        <h2 className="mt-4 text-lg font-semibold text-[#0F172A]">Completing Sign In...</h2>
        <p className="mt-2 text-sm text-[#64748B]">Please wait while we log you in securely.</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
