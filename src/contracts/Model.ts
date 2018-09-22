import HiddenOrbitProp from "./HiddenOrbitProp";

export default interface Model extends HiddenOrbitProp {
  readonly type: string;
  id: string;

  save(): Promise<void>;

  destroy(): Promise<void>;
}
