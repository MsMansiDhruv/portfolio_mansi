import HomeClient from "./HomeClient";
import "@/styles/mansi-world-of-data.css";

export const dynamic = "force-static";
export const revalidate = 86400;

export default function HomePage() {
  return <HomeClient />;
}
