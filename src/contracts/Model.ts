
export default interface Model {
  readonly type: string;
  id: string;

  destroy(): Promise<void>;
}
