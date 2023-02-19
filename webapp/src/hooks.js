import { useState, useEffect, useCallback, useRef } from 'react';
import { sendRequest } from './utils';

/** 
 * Hook for infinite pagination.
 * Remember to `setLoading(false)` after pulling the next page
 * Do `setFinished(true)` when there are no more pages left
 */
function useInfiniteScroll(callback) {
  const [loading, setLoading] = useState(false);
  const finishedRef = useRef(false);

  function setFinished() {
    finishedRef.current = true;
  }

  const handleScroll = () => {
    const doc = document.documentElement;
    const tolerance = window.innerHeight;
    
    // Ignore any scroll events that trigger on initial page load
    if (doc.scrollTop === 0) return;

    if (window.innerHeight + doc.scrollTop + tolerance >= doc.offsetHeight) {
      if (!finishedRef.current) {
        setLoading(true);
      }
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

  return [loading, setLoading, setFinished];
}

function useLoadDocument(uri) {
  const [document, setDocument] = useState(null);

  const loadDocument = useCallback(() => {
    sendRequest({
      uri,
      pass: (data) => setDocument(data)
    })
  }, [uri]);

  useEffect(loadDocument, [loadDocument]);

  return [document, loadDocument];
}

export {
  useInfiniteScroll,
  useLoadDocument
};
