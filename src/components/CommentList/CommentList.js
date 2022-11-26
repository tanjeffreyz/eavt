import './CommentList.css';
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { sendRequest } from '../../utils';
import { Plus, TrashCan } from '../Icons/Icons';
import { Form } from 'react-bootstrap';

function CommentList({
  document,
  loadDocument,
  uri
}) {
  uri = `${uri}/comments`;

  const [show, setShow] = useState(false);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const showModal = () => setShow(true);
  const hideModal = () => setShow(false);

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

  function onPass() {
    setSubject('');
    setBody('');
    loadDocument();
    hideModal();
  }

  function createNewComment() {
    if (body.length > 0) {
      sendRequest({
        uri,
        config: { 
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({subject, body})
        },
        pass: onPass
      });
    }
  }

  return (
    <>
      <div 
        align='left' 
        className='comment create-comment mb-2 px-2 py-2' 
        onClick={showModal}
        style={{cursor: 'pointer'}}
      >
        <Plus style={{position:'relative', top: '-1px'}}/> New Comment
      </div>

      {document.comments.slice(0).reverse().map(getComment)}

      <Modal show={show} onHide={hideModal} backdrop='static' centered>
        <Modal.Header closeButton>Create New Comment</Modal.Header>
        <Modal.Body>
          <Form.Control 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder='Subject' 
            className='mb-2'
          />
          <Form.Control 
            value={body}
            onChange={(e) => setBody(e.target.value)}
            as='textarea' 
            placeholder='Body'
            rows={3}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={hideModal}>Cancel</Button>
          <Button variant='primary' onClick={createNewComment}>Submit</Button>
        </Modal.Footer>
      </Modal>
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
        <span>Subject: {data.subject ? data.subject : 'N/A'}</span>
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

      <Modal show={show} onHide={hideModal} centered>
        <Modal.Header closeButton>Delete Comment</Modal.Header>
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
