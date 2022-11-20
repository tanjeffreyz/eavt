import { API_ROOT } from './config';
import { useState, useEffect } from 'react';

const sendRequest = async ({
  uri,
  config={},
  params=null,
  success=((data) => {}),
  fail=((error) => {})
}) => {
  let query = '';
  if (params !== null) {
    query = '?' + (new URLSearchParams(params));
  }

  fetch(API_ROOT + uri + query, config)
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      throw res;
    })
    .then(
      data => success(data),
      error => {
        console.error(error);
        fail(true);
        error.json().then((e) => fail(JSON.stringify(e, null, 2)));
      }
    );
};

const useInfiniteScroll = (callback) => {
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
  }, [loading]);

  return [loading, setLoading];
}

const getFlagSymbol = (flag) => {
  let symbol;
  switch(flag) {
    case 'star':
      symbol = '⭐';
      break;
    case 'error':
      symbol = '❌';
      break;
    default:
      symbol = flag;
  }
  return <div title={flag}>{symbol}</div>;
}

export {
  sendRequest,
  getFlagSymbol,
  useInfiniteScroll
};
