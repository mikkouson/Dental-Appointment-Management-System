"use client";
import { useCountStore } from "@/app/store";
export default function Page() {
  const qty = useCountStore((state) => state.count);
  const incr = useCountStore((state) => state.increment);

  return (
    <div>
      <span> {qty}</span>
      <button onClick={() => incr(1)}>asd</button>
    </div>
  );
}
