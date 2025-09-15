/**
 * The Sleep function helps to delay actions.
 * @param duration number
 * @return Promise
 */
export default async function Sleep(duration: number): Promise<number> {
  return new Promise((res) => {
    setTimeout(() => {
      res(duration);
    }, duration);
  });
}
