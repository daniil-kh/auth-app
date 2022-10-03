import {
  QueryResult,
  QueryResultTypeError,
  QueryResultTypeOk,
  QueryStatus,
} from './types';

export function isError<OT = unknown, ET extends Error = Error>(
  qr: QueryResult<OT, ET>,
): qr is QueryResultTypeError<ET> {
  return qr.status === QueryStatus.Error;
}

export function isOk<OT = unknown, ET extends Error = Error>(
  qr: QueryResult<OT, ET>,
): qr is QueryResultTypeOk<OT> {
  return qr.status === QueryStatus.Ok;
}

export function createQueryResult<
  ST extends QueryStatus,
  OT = unknown,
  ET extends Error = Error,
>(
  status: ST,
  data: ST extends QueryStatus.Ok ? OT : ET,
): ST extends QueryStatus.Ok
  ? QueryResultTypeOk<OT>
  : QueryResultTypeError<ET> {
  return { status, data } as ST extends QueryStatus.Ok
    ? QueryResultTypeOk<OT>
    : QueryResultTypeError<ET>;
}
