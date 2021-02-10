import { Query, Document } from 'mongoose';

export async function timeoutMongooseQuery<T, D extends Document>(
  pr: Query<T, D>,
) {
  const timeOutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject('taking longer than expected');
    }, 13000);
  });
  return (await Promise.race([pr, timeOutPromise])) as Promise<T>;
}
