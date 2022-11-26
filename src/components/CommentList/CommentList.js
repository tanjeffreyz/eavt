import './CommentList.css';
import { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { sendRequest } from '../../utils';
import { Edit, Plus, TrashCan } from '../Icons/Icons';
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
  const [validBody, setValidBody] = useState(true);

  const showModal = () => {
    setShow(true);
    setValidBody(true);
  };
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
    if (body.length === 0) {
      setValidBody(false);
    } else {
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
            onChange={(e) => {
              setBody(e.target.value);
              setValidBody(e.target.value.length > 0);
            }}
            as='textarea' 
            placeholder='Body'
            rows={10}
            isInvalid={!validBody}
          />
          <Form.Control.Feedback type='invalid'>
            Comment body must be non-empty
          </Form.Control.Feedback>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={hideModal}>Cancel</Button>
          <Button variant='primary' onClick={createNewComment}>Submit</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function Comment(props) {
  const [editing, setEditing] = useState(false);
  if (editing) {
    return <CommentEditor {...props} setEditing={setEditing} />;
  } else {
    return <CommentDisplay {...props} setEditing={setEditing} />;
  }
}

function CommentEditor({
  data,
  loadDocument,
  uri,
  setEditing
}) {
  const [subject, setSubject] = useState(data.subject);
  const [body, setBody] = useState(data.body);
  const [validBody, setValidBody] = useState(true);

  function updateComment() {
    if (body.length === 0) {
      setValidBody(false);
    } else {
      sendRequest({
        uri: `${uri}/${data._id}`,
        config: { 
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({subject, body})
        },
        pass: () => {
          setEditing(false);
          loadDocument();
        }
      });
    }
  }

  const date = new Date(data.dt);
  return (
    <div align='left' className='comment mb-2 px-2 py-2'>
      <Form.Control 
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder='Subject' 
        className='mb-2'
      />
      <p style={{color: 'gray'}}>{date.toLocaleString()}</p>
      <Form.Control 
        value={body}
        onChange={(e) => {
          setBody(e.target.value);
          setValidBody(e.target.value.length > 0);
        }}
        as='textarea' 
        placeholder='Body'
        rows={10}
        isInvalid={!validBody}
      />
      <Form.Control.Feedback type='invalid'>
        Comment body must be non-empty
      </Form.Control.Feedback>

      <div align='right' className='mt-2'>
        <Button 
          variant='secondary' 
          className='me-2'
          onClick={() => setEditing(false)}
        >
          Cancel
        </Button>
        <Button 
          variant='primary' 
          onClick={updateComment}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

function CommentDisplay({
  data,
  loadDocument,
  uri,
  setEditing
}) {
  const [showConfirm, setShowConfirm] = useState(false);

  const showModal = () => setShowConfirm(true);
  const hideModal = () => setShowConfirm(false);

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
        {data.subject ? <span><b>{data.subject}</b></span> : null}
        <p style={{color: 'gray'}}>{date.toLocaleString()}</p>
        <span dangerouslySetInnerHTML={{__html: data.body}} />
        <TrashCan 
          className='comment-button'
          style={{fill: 'red', top: '5px', right: '5px'}}
          title='Delete'
          onClick={showModal}
        />
        <Edit 
          className='comment-button'
          style={{fill: '#656565', top: '5px', right: '25px'}}
          title='Edit'
          onClick={() => setEditing(true)}
        />
      </div>

      <Modal show={showConfirm} onHide={hideModal} centered>
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
