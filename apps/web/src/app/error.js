'use client';

export default function Error({ error, reset }) {
  return (
    <div>
      <h1>Something went wrong!</h1>
      <button onClick={reset}>Try again</button>
      <a href="/">Go back home</a>
    </div>
  );
}
