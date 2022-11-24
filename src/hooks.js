import { useState, useEffect, useCallback } from 'react';
import { sendRequest } from './utils';

function useInfiniteScroll(callback) {
  const SCROLL_TOLERANCE = 25;
  const [loading, setLoading] = useState(false);

  const handleScroll = () => {
    const doc = document.documentElement;
    if (window.innerHeight + doc.scrollTop + SCROLL_TOLERANCE >= doc.offsetHeight) {
      setLoading(true);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!loading) return;
    callback();     // Load more items
  }, [loading, callback]);

  return [loading, setLoading];
}

function useLoadDocument(uri) {
  const [document, setDocument] = useState(null);

  const loadDocument = useCallback(() => {
    console.log('loaded document');
    sendRequest({
      uri,
      pass: (data) => setDocument(data)
    })
  }, []);

  useEffect(loadDocument, [loadDocument]);

  return [document, loadDocument];
}

export {
  useInfiniteScroll,
  useLoadDocument
};
