function Trials() {
  const test = ['1', '2', '3'];
  const list = test.map((t) => <li>{t}</li>);
  return (
    <>
      <h1>Trials</h1>
      <ol>
        {list}
      </ol>
    </>
  );
}

export default Trials;
