export const delay = (ms = 350) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
