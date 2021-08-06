import { Button, Form, Col } from "react-bootstrap";
import { useState } from "react";
import { MyRow } from "./style";

const Demographics = ({ page, nextPage, grabInformation }) => {
  const [values, setValues] = useState({});

  function handleSubmit(event) {
    event.preventDefault();
    grabInformation(values);
    nextPage();
  }
  function onChange(fieldId, value) {
    setValues((currentValues) => {
      currentValues[fieldId] = value;
      return currentValues;
    });
  }

  return (
    <Form onSubmit={handleSubmit}>
      <MyRow>
        <h1>{page.title}</h1>
      </MyRow>
      {page.attributes &&
        page.attributes.map((row, index) => (
          <Form.Group key={index} as={MyRow} controlId={row.label}>
            <Col lg="2">
              <Form.Label>{row.label}</Form.Label>
            </Col>
            <Col lg="2">
              <Form.Control
                type="text"
                value={values[row.label]}
                onChange={(e) => onChange(row.label, e.target.value)}
                placeholder={row.label}
              />
            </Col>
          </Form.Group>
        ))}
      <MyRow>
        <br />
      </MyRow>
      <MyRow>
        <Col>
          <Button variant="secondary" type="submit">
            Next
          </Button>{" "}
        </Col>
      </MyRow>
    </Form>
  );
};

export default Demographics;
