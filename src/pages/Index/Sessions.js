function Sessions() {
  const test = ['1', '2', '3'];
  const list = test.map((t) => <li>{t}</li>);
  return (
    <>
      <h1>Sessions</h1>
      <ol>
        {list}
      </ol>
    </>
  );
}

export default Sessions;
