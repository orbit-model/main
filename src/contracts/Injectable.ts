import Container from "../di/Container";

export default interface Injectable {
  _setOrbitDi(di: Container): void;
}
