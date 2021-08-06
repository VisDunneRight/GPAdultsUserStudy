import { Col, Button, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import Poca from "../../../Components/Poca/Poca";
import Area from "../../../Components/Area/Area";
import Angle from "../../../Components/Angle/Angle";
import Length from "../../../Components/Length/Length";
import Poua from "../../../Components/Poua/Poua";
import { MyRow } from "./style";

const Section = ({ page, data, saveAnswer, nextQuestion, questionIndex }) => {
  const [array, setArray] = useState([]);
  const [answer, setAnswer] = useState("");

  function handleNextQuestion(event) {
    event.preventDefault();
    if (answer === "") {
      alert("Please type a number before hitting next.");
      return;
    } else if (isNaN(Number(answer)) === true) {
      alert("Please make sure to type a number before hitting next.");
      return;
    } else if (Number(answer) < 0 || Number(answer) > 100) {
      alert("The number must be between 0 and 100.");
      return;
    }
    const answerName = data.answerName[questionIndex].toString();
    saveAnswer(answerName, answer).then(function (response) {
      setAnswer("");
      nextQuestion(array.length);
    });
  }

  function onChange(value) {
    setAnswer(value);
  }

  useEffect(() => {
    let lengths = [];
    let array = [];
    for (let used of page.valuesUsed) {
      let usedLength = 0;
      if (Array.isArray(data[used])) {
        usedLength = data[used].length;
      } else {
        usedLength = 1;
      }

      lengths.push(usedLength);
    }
    const maxLength = Math.max(...lengths);
    for (var i = 0; i < maxLength; i++) {
      let row = {};
      let index = 0;
      for (let used of page.valuesUsed) {
        const usedLength = lengths[index];
        index++;
        if (usedLength === 1) {
          row[used] = data[used];
        } else if (usedLength === maxLength) {
          row[used] = data[used][i];
        } else {
          console.log(
            "Something went wrong with number entries don't match max:",
            maxLength,
            "or 1:",
            used
          );
        }
      }
      array.push(row);
    }
    setArray(array);
  }, [data, page]);

  const typeRendering = (data, array, index, domain) => {
    switch (data.type) {
      case "POCA":
        return <Poca question={array[index]} domain={domain} />;
      case "Angle":
        return <Angle question={array[index]} domain={domain} />;
      case "Area":
        return <Area question={array[index]} domain={domain} />;
      case "Length":
        return <Length question={array[index]} domain={domain} />;
      case "POUA":
        return <Poua question={array[index]} domain={domain} />;
      default:
        throw new Error("Missing type of testing Section.");
    }
  };

  return (
    <>
      <MyRow>{typeRendering(data, array, questionIndex, data.Domain)}</MyRow>
      <MyRow>{array[questionIndex] && array[questionIndex].Question}</MyRow>
      <MyRow>
        <Col md={2}>
          <Form.Control
            type="text"
            placeholder=""
            id="Answer"
            onChange={(e) => onChange(e.target.value)}
            value={answer}
          />
        </Col>
      </MyRow>
      <MyRow>
        <br />
      </MyRow>
      <MyRow>
        <Col>
          <Button variant="secondary" onClick={handleNextQuestion}>
            Next
          </Button>{" "}
        </Col>
      </MyRow>
    </>
  );
};

export default Section;
