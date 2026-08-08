import { useEffect, useState } from 'react';
import { fetchAdminDashboard } from '../services/adminService';

export const useAdminData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await fetchAdminDashboard();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { data, loading, error };
};
