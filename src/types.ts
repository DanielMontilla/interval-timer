export type InputState = 'invalid' | 'valid'
export type InputType = string | number;
export interface InputData<T extends InputType> {
  content: T,
  state?: InputState
}
export type InputValidator = (n: string) => { isValid: boolean, msg: string }