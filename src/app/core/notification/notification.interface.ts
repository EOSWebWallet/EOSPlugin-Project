export interface IPrompt {
  type: PromptType;
  responder: Function;
}

export enum PromptType {
  REQUEST_IDENTITY,
}
