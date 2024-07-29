import Image from "next/image";
import Cardwarpper from "../components/ui/cardwarpper/cardwarpper";

export default function Home() {
  return (
    <Cardwarpper
      bar_content="Welcome to the Employee Management System"
      bar_title="Sign-In"
      bar_sub="Create an account "
      href="/auth/sign-up"
      color=""
      bg2=" bg-white"
      bg1="bg-gradient-to-b from-violet-600 to-indigo-600"
    >
      <div className="h-full w-full">
        <Image
          src="/test.gif"
          alt="Illustrative Image"
          width={1000}
          height={1000}
          objectFit="cover"
          className="rounded-lg shadow-lg"
        />
      </div>
    </Cardwarpper>
  );
}
