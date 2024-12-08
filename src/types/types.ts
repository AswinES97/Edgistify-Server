export type expressType = typeof import("express");

export interface IJwtPayload {
  fullname: string;
  userId: string;
}
