import { Col, Button, Image, Figure } from "react-bootstrap";
import { MyRow } from "./style";

const TypeImage = ({ type }) => {
  switch (type) {
    case "Area":
      return <Image src={process.env.PUBLIC_URL + "/Area.png"} />;
    case "Angle":
      return <Image src={process.env.PUBLIC_URL + "/Angle.png"} />;
    case "Length":
      return <Image src={process.env.PUBLIC_URL + "/Length.png"} />;
    case "POUA":
      return <Image src={process.env.PUBLIC_URL + "/POUA.png"} />;
    case "POCA":
      return <Image src={process.env.PUBLIC_URL + "/POCA.png"} />;
    default:
      return <></>;
  }
};

const RenderResults = ({ results }) => {
  return (
    <>
      <MyRow>
        <Col>More Accurate</Col>
        <Col>Less Accurate</Col>
      </MyRow>

      {results.map((row) => (
        <Col>
          <TypeImage key={row[0]} type={row[0]} />
        </Col>
      ))}
    </>
  );
};

const TypeSwitch = ({ data }) => {
  console.log(data);
  if (data.p) {
    return <MyRow>{data.p}</MyRow>;
  } else if (data.image) {
    const image = data.image;
    return (
      <MyRow>
        <Figure>
          <Figure.Image
            height={image.height ? image.height : "100%"}
            width={image.width ? image.width : "100%"}
            src={process.env.PUBLIC_URL + "/" + image.src}
          />
          <Figure.Caption>{image.caption}</Figure.Caption>
        </Figure>
      </MyRow>
    );
  } else {
    return <></>;
  }
};

const Information = ({ page, nextPage, exportStudy, results }) => {
  if (page.finish === true) {
    // localStorage.clear();
  }
  return (
    <>
      <MyRow>
        <h1>{page.title}</h1>
      </MyRow>
      {page.html &&
        page.html.map((line, index) => (
          <TypeSwitch key={index} data={line}></TypeSwitch>
        ))}
      <MyRow>
        <br />
      </MyRow>
      {page.finish === true ? (
        <>
          <MyRow>
            <RenderResults results={results} />
          </MyRow>
          <MyRow>
            <Col>
              <Button variant="secondary" onClick={exportStudy}>
                Download File
              </Button>{" "}
            </Col>
          </MyRow>
        </>
      ) : (
        <MyRow>
          <Col>
            <Button variant="secondary" onClick={nextPage}>
              Next
            </Button>{" "}
          </Col>
        </MyRow>
      )}
    </>
  );
};

export default Information;
