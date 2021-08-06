import React from "react";
import studyData from "../Data/studyData.json";
import studyMeta from "../Data/studyMeta.json";
import Pages from "./Pages/Pages";
import { MyContainer, MyDiv, MyProgressBar } from "./style";
import { Navbar } from "react-bootstrap";

class Section extends React.Component {
  state = {
    data: {},
    siteStructure: {},
    progress: 0,
    currSession: { currPage: 0, id: 0, questionIndex: 0 },
    answers: [],
    results: [],
  };

  componentDidMount() {
    const data = studyData;
    const siteStructure = studyMeta;
    this.setState({ data: data, siteStructure: siteStructure });
    const progress = localStorage.getItem("Progress");
    const progressLabel = localStorage.getItem("ProgressLabel");
    const currSession = localStorage.getItem("currSession");
    const answers = localStorage.getItem("answers");
    if (progress) {
      this.setState({ progress: progress });
    }
    if (progressLabel) {
      this.setState({ progressLabel: progressLabel });
    }
    if (currSession) {
      this.setState({ currSession: JSON.parse(currSession) });
    } else {
      this.setState({ currSession: { currPage: 0, id: 0 } });
    }
    if (answers) {
      this.setState({ answers: JSON.parse(answers) });
    }
  }

  calculateAccuracy = () => {
    const dataAnswer = this.state.data[this.state.currSession.id];

    let results = [];
    if (dataAnswer === undefined) {
      return;
    }
    console.log(dataAnswer);
    dataAnswer.map((type, index) => {
      const currType = type.type;
      let total = 0.0;
      const size = type.answerName.length;
      for (let i = 0; i < size; i++) {
        const answerLst = this.state.answers[i + index * size];
        console.log(answerLst);
        console.log(i + index * size, this.state.answers);
        const answer = parseFloat(answerLst[0].split(",")[1]);
        total += Math.abs(answer * 100 - parseInt(answerLst[1]));
      }
      results.push([currType, total]);
    });
    results.sort(function (a, b) {
      return a[1] - b[1];
    });
    this.setState({ results: results });
  };

  nextPage = () => {
    const currSession = this.state.currSession;
    currSession.currPage += 1;
    currSession.questionIndex = 0;
    // const currType = this.state.siteStructure.pages[currSession.currPage].type;
    // if (currType === "Section") {
    this.setProgressBar(0, "");
    // } else {
    //   this.setProgressBar(
    //     "Page " +
    //       (currSession.currPage / (this.state.siteStructure.pages.length - 1)) *
    //         100,
    //     currSession.currPage +
    //       " / " +
    //       (this.state.siteStructure.pages.length - 1)
    //   );
    // }
    localStorage.setItem("currSession", JSON.stringify(currSession));
    this.setState({ currSession: currSession });
    if (this.state.siteStructure.pages.length - 1 === currSession.currPage) {
      this.exportStudy();
      this.calculateAccuracy();
    }
  };

  setProgressBar = (value, label) => {
    localStorage.setItem("Progress", value);
    localStorage.setItem("ProgressLabel", label);
    this.setState({ progress: value, progressLabel: label });
  };

  nextQuestion = (length) => {
    const currSession = this.state.currSession;
    currSession.questionIndex += 1;
    if (currSession.questionIndex === length) {
      this.nextPage();
      return;
    }
    this.setProgressBar(
      (currSession.questionIndex / length) * 100,
      "Question " + currSession.questionIndex + " / " + length
    );
    localStorage.setItem("currSession", JSON.stringify(currSession));
    this.setState({ currSession: currSession });
  };

  grabInformation = (data) => {
    console.log("grab Information");
    const currSession = this.state.currSession;
    currSession.demographic = data;
    const sessionID = this.state.siteStructure.meta.sessionID;
    if (sessionID in data) {
      currSession.id = data[sessionID];
    }
    localStorage.setItem("currSession", JSON.stringify(currSession));
    this.setState({ currSession: currSession });
  };

  saveAnswer = (field, answer) => {
    const newAnswers = this.state.answers.slice();
    newAnswers.push([field, answer]);
    localStorage.setItem("answers", JSON.stringify(newAnswers));
    this.setState({ answers: newAnswers });
    return Promise.resolve(newAnswers);
  };

  exportStudy = () => {
    this.calculateAccuracy();
    var FileSaver = require("file-saver");

    let jsonFile = {
      session: this.state.currSession,
      answers: this.state.answers,
    };

    var jsonse = JSON.stringify(jsonFile, null, 2);

    var blob = new Blob([jsonse], { type: "application/json" });
    FileSaver.saveAs(blob, "user" + this.state.currSession.id + ".json");
  };

  render() {
    return (
      <MyDiv>
        <MyContainer>
          <Navbar expand="lg" variant="light" bg="light">
            <MyProgressBar
              now={this.state.progress}
              label={this.state.progressLabel}
            />
          </Navbar>
          <Pages
            siteStructure={this.state.siteStructure}
            currPage={
              this.state.currSession != null
                ? this.state.currSession.currPage
                : undefined
            }
            data={this.state.data}
            sessionID={
              this.state.currSession != null
                ? this.state.currSession.id
                : undefined
            }
            grabInformation={this.grabInformation}
            saveAnswer={this.saveAnswer}
            nextPage={this.nextPage}
            nextQuestion={this.nextQuestion}
            exportStudy={this.exportStudy}
            results={this.state.results}
            questionIndex={
              this.state.currSession != null
                ? this.state.currSession.questionIndex
                : undefined
            }
          />
        </MyContainer>
      </MyDiv>
    );
  }
}

export default Section;
