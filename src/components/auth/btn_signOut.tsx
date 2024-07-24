import { logout } from "../../../action/logout";
import { Button } from "../ui/button";

export default function Btn_signOut() {
  const onClick = () => {
    logout();
  };
  return (
    <div className="flex h-full w-full">
      <Button
        onClick={onClick}
        variant={"destructive"}
        className="h-28 w-28 rounded-full bg-red-800 hover:bg-red-600"
      >
        Sign-Out
      </Button>
    </div>
  );
}
