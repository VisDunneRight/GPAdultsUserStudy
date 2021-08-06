import { Container, ProgressBar } from "react-bootstrap";
import styled from "styled-components";

export const MyContainer = styled(Container)`
  background-color: white;
  min-height: 600px;
`;

export const MyDiv = styled.div`
  background-color: lightgray;
  display: flex;
  flex-flow: column;
  min-height: 100vh;
`;

export const MyProgressBar = styled(ProgressBar)`
  width: 100vw;
  color: ${(props) => props.barColor};
`;
