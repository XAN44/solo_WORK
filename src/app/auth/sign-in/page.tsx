import dynamic from "next/dynamic";
import Cardwarpper from "../../../components/ui/cardwarpper/cardwarpper";

const Form_LOGIN = dynamic(
  () => import("../../../components/auth/form_Login"),
  {
    ssr: false, // โหลดเฉพาะบน client-side
  },
);

export default function Page() {
  return (
    <Cardwarpper
      bar_content="if you don't have an account "
      bar_title="Sign-In"
      bar_sub="REGISTER"
      href="/auth/sign-up"
      color=""
      bg2=" bg-white"
      bg1="bg-gradient-to-b from-violet-600 to-indigo-600"
    >
      <Form_LOGIN />
    </Cardwarpper>
  );
}
