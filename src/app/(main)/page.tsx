"use client";

import { useStore } from "@/lib/store";
import "./page.styles.scss";

export default function Home() {
  const { count, increment } = useStore();

  return (
    <div>
      <header>
        <h1>Zustand Counter</h1>
      </header>
      <main>
        <p>Count: {count}</p>
        <button onClick={increment}>Increment</button>
      </main>
    </div>
  );
}
