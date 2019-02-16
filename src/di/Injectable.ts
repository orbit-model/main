import Container from "./Container";

export default interface Injectable {
  _setOrbitDi(di: Container): void;
}
