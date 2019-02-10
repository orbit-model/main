
export default interface Model {
  readonly type: string;
  id: string;

  save(): Promise<void>;

  destroy(): Promise<void>;
}
