
export default interface Getter<MODEL> {
  (attr: string, model: MODEL): any
}
