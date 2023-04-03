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

/**
 * Loads a single document
 */
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

/**
 * Loads all pages from a list of datasets of the form: {uri, setDataFunction}
 */
function useLoadDatasets({
  limit=100
}) {
  const [numLoaded, setNumLoaded] = useState(0);    // Tracks number of datasets loaded

  /** Gets all pages of data from multiple endpoints */
  function loadDatasets(datasets) {
    datasets.forEach((params) => {
      getAllPages({...params});
    });
  }

  /** Gets all pages of data from `uri`, appends to data using `setData`. */
  function getAllPages({
    uri,
    setData=((data) => {})
  }) {
    function recur(cursor) {
      sendRequest({
        uri,
        params: { cursor, limit },
        pass: (data) => {
          setData((prev) => [...prev, ...data.documents]);
          if (data.hasNext) {
            recur(data.cursor);
          } else {
            setNumLoaded((prev) => prev + 1);
          }
        }
      });
    }
    recur(null);
  }

  return [numLoaded, loadDatasets];
}

export {
  useInfiniteScroll,
  useLoadDocument,
  useLoadDatasets
};
