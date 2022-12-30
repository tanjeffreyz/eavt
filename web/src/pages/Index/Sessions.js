import { useState } from 'react';
import { addWordBreaks, sendRequest } from '../../utils';
import { Flag } from '../../components/Flag/Flag';
import DocumentList from '../../components/DocumentList/DocumentList';
import { Collapse, Button, Modal, Form } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Section from '../../components/Section/Section';
import { Plus } from '../../components/Icons/Icons';

function Sessions() {
  const [show, setShow] = useState(false);
  const [sessionName, setSessionName] = useState('');
  const [validSessionName, setValidSessionName] = useState(true);

  const showModal = () => {
    setShow(true);
    setValidSessionName(true);
  };
  const hideModal = () => setShow(false);
  
  function createNewSession() {
    if (sessionName.length === 0) {
      setValidSessionName(false);
    } else {
      sendRequest({
        uri: '/sessions',
        config: {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({path: sessionName})
        },
        pass: () => window.location.reload(false),
        fail: () => setValidSessionName(false)
      })
    }
  }

  return (
    <>
      <Section fluid align='center'>
        <h1>Sessions</h1>
        <Button onClick={showModal}>
          <Plus 
            style={{position:'relative', top: '-1px', marginLeft: '-2px'}} 
            className='me-1' 
          /> 
          New Session
        </Button>
        <DocumentList 
          headers={['#', 'Name', 'Date & Time', 'Flag']}
          uri='/sessions'
          params={{ field: 'dt' }}
          Row={SessionRow}
        />
      </Section>

      <Modal show={show} onHide={hideModal} backdrop='static' centered>
        <Modal.Header closeButton>Create New Session</Modal.Header>
        <Modal.Body>
          <Form.Control 
            value={sessionName}
            onChange={(e) => {
              setSessionName(e.target.value)
              setValidSessionName(true)
            }}
            placeholder='Session Name' 
            className='mb-2'
            isInvalid={!validSessionName}
          />
          <Form.Control.Feedback type='invalid'>
            Session already exists
          </Form.Control.Feedback>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={hideModal}>Cancel</Button>
          <Button variant='primary' onClick={createNewSession}>Submit</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function SessionRow({
  document, 
  index
}) {
  const [dropdownState, setDropdownState] = useState(false);
  const sessionName = addWordBreaks(document.path);
  const date = new Date(document.dt);
  return (
    <LinkContainer key={index} to={`/sessions/${document._id}`}>
      <tr>
        <td>{index+1}</td>
        <td>
          <Button
            onClick={(e) => {
              setDropdownState((prev) => !prev);
              e.stopPropagation();
            }}
            aria-expanded={dropdownState}
            size='sm'
            variant='outline-primary'
          >
            {sessionName}
          </Button>
          <Collapse in={dropdownState}>
            <div>sparkline or metadata</div>
          </Collapse>
        </td>
        <td>{date.toLocaleString()}</td>
        <td>{<Flag value={document.flag} />}</td>
      </tr>
    </LinkContainer>
  );
}

export default Sessions;
