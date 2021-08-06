import React from "react";
import Demographics from "./Demographic/Demographic";
import Information from "./Information/Information";
import Break from "./Break/Break";
import Section from "./Section/Section";

const Option = ({
  page,
  data,
  grabInformation,
  saveAnswer,
  questionIndex,
  exportStudy,
  nextQuestion,
  nextPage,
  results,
}) => {
  if (page.type === "Demographic") {
    return (
      <Demographics
        page={page}
        grabInformation={grabInformation}
        nextPage={nextPage}
      />
    );
  } else if (page.type === "Information") {
    return (
      <Information
        page={page}
        nextPage={nextPage}
        exportStudy={exportStudy}
        results={results}
      />
    );
  } else if (page.type === "Section") {
    return (
      <Section
        page={page}
        data={data[page.position]}
        saveAnswer={saveAnswer}
        questionIndex={questionIndex}
        nextQuestion={nextQuestion}
      />
    );
  } else if (page.type === "Break") {
    return <Break page={page} nextPage={nextPage} />;
  } else {
    console.log("Page missing", page.type);
    return <></>;
  }
};

const Pages = ({
  siteStructure,
  data,
  grabInformation,
  currPage,
  sessionID,
  saveAnswer,
  nextPage,
  exportStudy,
  nextQuestion,
  questionIndex,
  results,
}) => {
  return (
    <>
      {siteStructure.pages && (
        <Option
          key={currPage}
          page={siteStructure.pages[currPage]}
          data={data[sessionID]}
          grabInformation={grabInformation}
          saveAnswer={saveAnswer}
          exportStudy={exportStudy}
          nextPage={nextPage}
          nextQuestion={nextQuestion}
          questionIndex={questionIndex}
          results={results}
        />
      )}
    </>
  );
};

export default Pages;
