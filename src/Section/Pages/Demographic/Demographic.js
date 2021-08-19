import { Button, Form, Col } from "react-bootstrap";
import { useState } from "react";
import { MyRow } from "./style";

const Options = ({ property, values, onChange }) => {
  if (property.type === "text") {
    return (
      <Form.Control
        required
        type="text"
        value={values[property.label]}
        onChange={(e) => onChange(property.label, e.target.value)}
        placeholder={property.label}
      />
    );
  } else if (property.type === "combobox") {
    return (
      <Form.Control
        required
        as="select"
        name="selected"
        onChange={(e) => onChange(property.label, e.target.value)}
        value={values[property.label]}
      >
        {property.options.map((item, index) => (
          <option key={index} value={item}>
            {item}
          </option>
        ))}
      </Form.Control>
    );
  }
};

const Demographics = ({ page, nextPage, grabInformation }) => {
  const [values, setValues] = useState({});

  function handleSubmit(event) {
    event.preventDefault();
    grabInformation(values);
    nextPage();
  }
  function onChange(fieldId, value) {
    console.log(value);
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
              <Options property={row} onChange={onChange} values={values} />
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
