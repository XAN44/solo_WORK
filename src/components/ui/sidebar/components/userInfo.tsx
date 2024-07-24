import { ExtendendUser } from "../../../../app/types/next-auth";

interface Props {
  user?: ExtendendUser;
}

function UserInfo({ user }: Props) {
  return (
    <div className="flex h-full w-full">
      <div className="flex h-full w-full flex-col items-center justify-center space-y-5 text-center text-xl text-white">
        <h1 className="">Hello {user?.username}</h1>
        <p>
          Role {user?.job} {user?.role}
        </p>
        <p>Level User : {user?.level}</p>
      </div>
    </div>
  );
}

export default UserInfo;
