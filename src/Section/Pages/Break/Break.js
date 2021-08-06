import { Row, Button } from "react-bootstrap";

const Break = ({ page, nextPage }) => {
  return (
    <>
      <Row>
        <h1>{page.title}</h1>
      </Row>
      <pre>{page.text}</pre>
      {/* </Row> */}
      <Button variant="secondary" onClick={nextPage}>
        Next
      </Button>{" "}
    </>
  );
};

export default Break;
