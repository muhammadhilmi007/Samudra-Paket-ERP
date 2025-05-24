'use client';

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <div>
          <h1>Global Error</h1>
          <button onClick={() => reset()}>Try again</button>
          <a href="/">Go home</a>
        </div>
      </body>
    </html>
  );
}
