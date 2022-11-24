import { API_ROOT } from './config';
import { useState, useEffect } from 'react';

async function sendRequest({
  uri,
  config={},
  params=null,
  pass=((data) => {}),
  fail=((error) => {})
}) {
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
      data => pass(data),
      error => {
        console.error(error);
        fail(true);
        error.json().then((e) => fail(JSON.stringify(e, null, 2)));
      }
    );
};

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

function getFlagSymbol(flag) {
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

function addWordBreaks(text) {
  const segments = text.split(/_/g);
  let result = segments[segments.length-1];
  for (let i = segments.length - 2; i >= 0; i--) {
    result = <>{segments[i] + '_'}<wbr />{result}</>;
  }
  return result;
}

/** Asynchronous batched for-loop that applies the function `f` to `arr` */
function asyncFor({
  arr, 
  f, 
  batchSize=32, 
  callback=(() => {})
}) {
  const recur = (i) => {
    console.log(i);
    if (i >= arr.length) {
      callback();
    } else {
      arr.slice(i, i + batchSize).forEach(f);
      setTimeout(() => recur(i + batchSize));
    }
  };
  recur(0);
}

/** Asynchronous batched map operation that maps the function `f` onto `arr` */
function asyncMap({
  arr,
  f,
  batchSize=32,
  callback=((data) => {})
}) {
  const result = [];
  const recur = (i) => {
    if (i >= arr.length) {
      callback(result);
    } else {
      const batch = arr.slice(i, i + batchSize);
      result.push(...batch.map(f));
      setTimeout(() => recur(i + batchSize));
    }
  };
  recur(0);
}

export {
  sendRequest,
  getFlagSymbol,
  useInfiniteScroll,
  addWordBreaks,
  asyncFor,
  asyncMap
};
