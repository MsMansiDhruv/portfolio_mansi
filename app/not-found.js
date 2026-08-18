import Link from "next/link";

export default function NotFound() {
  return (
    <main className="wd-miss">
      <div>
        <p className="wd-miss__kicker">404</p>
        <h1>This path is not on the map.</h1>
        <Link href="/">Return home</Link>
      </div>
    </main>
  );
}
