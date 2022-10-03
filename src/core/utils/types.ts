export enum QueryStatus {
  Ok = 'ok',
  Error = 'error',
}

export interface QueryResultType<T extends QueryStatus, DT = unknown> {
  status: T;
  data: DT;
}

export type QueryResultTypeOk<T = unknown> = QueryResultType<QueryStatus.Ok, T>;

export type QueryResultTypeError<T extends Error = Error> = QueryResultType<
  QueryStatus.Error,
  T
>;

export type QueryResult<OT = unknown, ET extends Error = Error> =
  | QueryResultTypeOk<OT>
  | QueryResultTypeError<ET>;
