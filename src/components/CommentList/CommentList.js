import './CommentList.css';
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { sendRequest } from '../../utils';
import { TrashCan } from '../Icons/Icons';

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
  const [show, setShow] = useState(false);

  const showModal = () => setShow(true);
  const hideModal = () => setShow(false);

  function deleteComment() {
    sendRequest({
      uri: `${uri}/${data._id}`,
      config: { method: 'DELETE' },
      pass: loadDocument
    });
    hideModal();
  }

  const date = new Date(data.dt);
  return (
    <>
      <div align='left' className='comment mb-2 px-2 py-2'>
        <span>Author: {data.author ? data.author : 'Anonymous'}</span>
        <p>{date.toLocaleString()}</p>
        <span>{data.body}</span>
        <TrashCan 
          width={20} 
          height={20} 
          className='comment-button'
          style={{fill: 'red', top: '5px', right: '5px'}}
          title='Delete comment'
          onClick={showModal}
        />
      </div>

      <Modal show={show} onHide={hideModal}>
        <Modal.Header closeButton>
          {/* <Modal.Title>Delete comment</Modal.Title> */}
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this comment?</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={hideModal}>Cancel</Button>
          <Button variant='danger' onClick={deleteComment}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </>
    
  );
}

export default CommentList;
