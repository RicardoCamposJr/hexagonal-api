import { TStatus } from "../../../types/TStatus/TStatus";

export default class Task {
  constructor(
    public id: number | null | undefined,
    public title: string,
    public description: string,
    public status: TStatus | null
  ) {}
}