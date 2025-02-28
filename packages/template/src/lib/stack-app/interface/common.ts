// Common types used across multiple interface files

export type AsyncStoreProperty<Name extends string, Args extends any[], Value, IsMultiple extends boolean> =
  & { [key in `${IsMultiple extends true ? "list" : "get"}${Capitalize<Name>}`]: (...args: Args) => Promise<Value> }
  // NEXT_LINE_PLATFORM react-like
  & { [key in `use${Capitalize<Name>}`]: (...args: Args) => Value }

export type EmailConfig = {
  host: string,
  port: number,
  username: string,
  password: string,
  senderEmail: string,
  senderName: string,
}
