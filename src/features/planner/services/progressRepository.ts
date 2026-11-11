export interface ProgressRepository {
  load(): Promise<string[]>;
  add(titleIds: string[]): Promise<void>;
  remove(titleId: string): Promise<void>;
  removeMany(titleIds: string[]): Promise<void>;
  clear(): Promise<void>;
}
