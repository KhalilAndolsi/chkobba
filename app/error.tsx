"use client"; // Error boundaries must be Client Components

import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {

  return (
    <section className="flex items-center justify-center h-dvh flex-col bg-lime-700 text-white">
      <h2 className="text-3xl p-4">Something went wrong!</h2>
      <p className="pb-8 max-w-[70vw] text-center">
        if you have any feedback please leve your mesage{" "}
        <a
          href="https://github.com/KhalilAndolsi/chkobba/issues"
          target="_blank"
          className="underline">
          here
        </a>{" "}
        and thx for u <span className="text-red-700 text-lg">♥</span>
      </p>
      <Button className="bg-red-700" onClick={() => reset()}>
        Try again
      </Button>
    </section>
  );
}
