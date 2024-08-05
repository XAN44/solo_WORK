import Image from "next/image";
import Cardwarpper from "../components/ui/cardwarpper/cardwarpper";

export default function Home() {
  return (
    <Cardwarpper
      bar_title="Welcome"
      bar_content=" "
      bar_sub="back to dashboard"
      href="/dashboard"
      color=""
      bg2=" bg-white"
      bg1="bg-gradient-to-b from-violet-600 to-indigo-600"
    >
      <div className="h-full w-full">
        <Image
          src="/test2.gif"
          alt="Illustrative Image"
          width={1600}
          height={1600}
          className="h-full w-full shadow-lg"
        />
      </div>
    </Cardwarpper>
  );
}
