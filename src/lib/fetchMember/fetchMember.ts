import { Option } from "../../components/ui/multipleSelect";
import UserInfo from "../../components/ui/sidebar/components/userInfo";

interface UserInfo {
  id: string;
  username: string | null;
}

export const FetchUserOptions = (users: UserInfo[]): Option[] => {
  console.log(users);
  return users.map((user) => ({
    label: user.username ?? "Unknown",
    value: user.id,
  }));
};
