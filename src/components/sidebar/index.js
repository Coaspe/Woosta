import useUser from "../../hooks/use-user";
import { useContext } from "react";
import UserContext from "../../context/user";
import User from "./User";
import Suggestion from "./Suggestions";

const Sidebar = () => {
  const { user } = useContext(UserContext);
  const x = useUser(user?.uid);
  return (
    <div className="p-4 font-stix">
      <div className="fixed">
        <User username={x.user?.username} fullName={x.user?.fullName} />
        <Suggestion
          userId={x.user?.userId}
          following={x.user?.following}
          loggedInUserDocId={x.user?.docId}
        />
      </div>
    </div>
  );
};

export default Sidebar;
