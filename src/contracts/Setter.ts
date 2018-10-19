
export default interface Setter<MODEL> {
  (attr: string, value: any, model?: MODEL): void
}
