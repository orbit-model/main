import OrbitModelMeta from "../meta/OrbitModelMeta";

export default interface Model {
  readonly type: string;
  id: string;

  __orbitModelMeta: OrbitModelMeta<Model>;

  destroy(): Promise<void>;
}
