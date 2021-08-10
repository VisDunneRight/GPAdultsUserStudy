import React from "react";
import studyData from "../Data/studyData.json";
import studyMeta from "../Data/studyMeta.json";
import practiceQuestions from "../Data/dataForPractice.json";
import Pages from "./Pages/Pages";
import { MyContainer, MyDiv, MyProgressBar } from "./style";
import { Navbar } from "react-bootstrap";
import nodemailer from "nodemailer";

require("dotenv").config({ path: "./email.env" });

class Section extends React.Component {
  state = {
    data: {},
    siteStructure: {},
    progress: 0,
    currSession: { currPage: 0, id: 0, questionIndex: 0 },
    answers: [],
    practiceAnswers: [],
    results: [],
    practiceQuestions: [],
  };

  componentDidMount() {
    const data = studyData;
    const siteStructure = studyMeta;
    const practice = practiceQuestions[0];
    this.setState({
      data: data,
      siteStructure: siteStructure,
      practiceQuestions: practice,
    });
    const progress = localStorage.getItem("Progress");
    const progressLabel = localStorage.getItem("ProgressLabel");
    const currSession = localStorage.getItem("currSession");
    const answers = localStorage.getItem("answers");
    const practiceAnswers = localStorage.getItem("practiceAnswers");

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
    if (practiceAnswers) {
      this.setState({ practiceAnswers: JSON.parse(practiceAnswers) });
    }
  }

  calculateAccuracy = () => {
    const dataAnswer = this.state.data[this.state.currSession.id];

    let results = [];
    if (dataAnswer === undefined) {
      return;
    }

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
    this.setProgressBar(0, "");

    const page = this.state.siteStructure.pages[currSession.currPage];

    if (page.type === "Check") {
      if (!this.checkPracticeQuestions()) {
        currSession.currPage = this.state.siteStructure.pages.length - 1;
      }
    }

    localStorage.setItem("currSession", JSON.stringify(currSession));
    this.setState({ currSession: currSession });
    if (page.finish && page.finish === true) {
      this.exportStudy();
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

  checkPracticeQuestions = () => {
    //group similar properties
    const answers = this.state.practiceAnswers;
    let grouping = {};
    for (let answer of answers) {
      const type = answer[0].split(",")[0];
      if (type in grouping) {
        grouping[type].push(answer);
      } else {
        grouping[type] = [answer];
      }
    }
    for (const [, lst] of Object.entries(grouping)) {
      let incorrect = 0;
      for (const answer of lst) {
        const portion = answer[0].split(",")[1];
        const results = parseInt(answer[1]);
        if (Math.abs(results - portion * 100) >= 30) {
          incorrect++;
        }
      }
      if (incorrect > 1) {
        return false;
      }
    }
    return true;
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

  savePracticeAnswer = (field, answer) => {
    const newAnswers = this.state.practiceAnswers.slice();
    newAnswers.push([field, answer]);
    localStorage.setItem("practiceAnswers", JSON.stringify(newAnswers));
    this.setState({ practiceAnswers: newAnswers });
    return Promise.resolve(newAnswers);
  };

  exportStudy = () => {
    this.calculateAccuracy();

    let jsonFile = {
      session: this.state.currSession,
      answers: this.state.answers,
    };

    var jsonse = JSON.stringify(jsonFile, null, 2);
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME, // generated ethereal user
        pass: process.env.EMAIL_PASSWORD, // generated ethereal password
      },
    });

    // send mail with defined transport object
    transporter.sendMail({
      from: "GP Adult Study <panavas.l@northeastern.edu>", // sender address
      to: "panavas.l@northeastern.edu", // list of receivers
      subject: this.state.currSession.id + " Study", // Subject line
      text: jsonse, // plain text body
    });
    // var blob = new Blob([jsonse], { type: "application/json" });
    // FileSaver.saveAs(blob, "user" + this.state.currSession.id + ".json");
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
            practiceQuestions={this.state.practiceQuestions}
            grabInformation={this.grabInformation}
            saveAnswer={this.saveAnswer}
            savePracticeAnswer={this.savePracticeAnswer}
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
