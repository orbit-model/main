
export default interface Model {
  readonly type: string;
  id: string | undefined;

  destroy(): Promise<void>;
}
