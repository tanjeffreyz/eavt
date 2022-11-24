import './CommentList.css';

function CommentList({
  document,
  loadDocument,
  uri
}) {
  const comments = document.comments;
  if (!comments || comments.length == 0) {
    return <span>No comments found</span>;
  }

  function getComment(c, i) {
    return (
      <Comment 
        key={i} 
        data={c} 
        loadDocument={loadDocument}
        uri={uri}
      />
    );
  }

  return (
    <>
      {comments.slice(0).reverse().map(getComment)}
    </>
  );
}

function Comment({
  data,
  loadDocument,
  uri
}) {
  const date = new Date(data.dt);
  return (
    <div align='left' className='comment mb-2 px-2 py-2'>
      <span>Author: {data.author ? data.author : 'Anonymous'}</span>
      <p>{date.toLocaleString()}</p>
      <span>{data.body}</span>
    </div>
  );
}

export default CommentList;
