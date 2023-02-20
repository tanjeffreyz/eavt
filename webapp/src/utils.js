import { API_ROOT } from './config';

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

/** Stores a key, value pair into localStorage with an optional expiration time (in milliseconds) */
function storageAdd(key, value, maxAge=null) {
  const data = {
    value,
    expiration: (maxAge === null ? null : Date.now() + maxAge)
  };
  localStorage.setItem(key, JSON.stringify(data));
}

/** Retrieves the data associated with KEY from localStorage */
function storageGet(key) {
  const now = Date.now();
  const data = JSON.parse(localStorage.getItem(key));
  const expired = (data.expiration === null ? false : now > data.expiration);
  return [data.value, expired];
}

export {
  sendRequest,
  asyncFor,
  asyncMap,
  addWordBreaks
};
