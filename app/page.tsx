import "@/styles/chkobba-game.css";
import dynamic from "next/dynamic";
const Game = dynamic(() => import("@/components/features/Game"), {
  ssr: true,
});

export default function Home() {
  return (
    <>
      <main className={"chkobba_game"}>
        <section>
          <Game />
        </section>
        <p className="text-center w-full p-2 text-sm">
          Created By{" "}
          <a
            href="https://github.com/KhalilAndolsi"
            target="_blank"
            className="underline">
            Khalil Andolsi
          </a>
        </p>
      </main>
    </>
  );
}
