import { API_ROOT } from './config';

const sendRequest = async ({
  uri,
  config={},
  params=null,
  setData=(() => {}),
  setError=(() => {}),
  setLoading=(() => {})
}) => {
  let query = '';
  if (params !== null) {
    query = '?' + new URLSearchParams({field: 'dt'});
  }

  fetch(API_ROOT + uri + query, config)
    .then(res => {
      if (res.ok) {
        return res.json();
      }
      throw res;
    })
    .then(
      data => setData(data),
      error => {
        console.error(error);
        setError(true);
        error.json().then((e) => setError(JSON.stringify(e, null, 2)));
      }
    )
    .finally(() => setLoading(false));
};

export {
  sendRequest
};
