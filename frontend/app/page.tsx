import Link from "@/node_modules/next/link";

export default function Home() {
  return (
    <main>
      <Link href="/subjects">Subjects</Link>
      <Link href="/decks">Decks</Link>
    </main>
  );
}
