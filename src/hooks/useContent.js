'use client';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import ContentService from '@/services/content.service';

export const useContent = (filters = {}) => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isFirstRender = useRef(true);

  const filterString = useMemo(() => JSON.stringify(filters), [filters]);

  const fetchContent = useCallback(async () => {
    if (!isFirstRender.current) {
      setLoading(true);
    }
    isFirstRender.current = false;
    try {
      const data = await ContentService.getContent(filters);
      setContent(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filterString]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchContent();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchContent]);

  return { content, loading, error, refresh: fetchContent };
};
