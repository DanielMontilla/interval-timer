export type InputState = 'invalid' | 'valid'
export interface InputData {
  content: string | number,
  state?: InputState
}
export type InputValidator = (n: string) => { isValid: boolean, msg: string }