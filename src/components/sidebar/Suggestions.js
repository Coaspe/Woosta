import { useEffect, useState } from "react";
import propTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import { getSuggestedProfiles } from "../../services/firebase";
import SuggestedProfile from "./SuggestedProfile";
import { motion } from "framer-motion";

const Suggestion = ({ userId, following, loggedInUserDocId }) => {
  const [profiles, setProfiles] = useState(null);
  const postVariant = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1,
      transition: {
        duration: 0.7,
      },
    },
  };
  // get the suggested profiles
  useEffect(() => {
    async function suggestedProfiles() {
      const response = await getSuggestedProfiles(userId, following);
      setProfiles(response);
    }
    if (userId) {
      suggestedProfiles();
    }
  }, [userId]);

  return !profiles ? (
    <Skeleton count={10} height={150} className="mt-5" />
  ) : profiles.length > 0 ? (
    <motion.div
      className="rounede flex flex-col"
      variants={postVariant}
      initial="initial"
      animate="animate"
    >
      <div className="text-sm flex items-center align-items justify-between mb-2">
        <p className="font-bold text-gray-base">Suggestions for you</p>
      </div>
      <div className="mt-4 grid gap-5">
        {profiles.map((profile) => (
          <SuggestedProfile
            key={profile.docId}
            profileDocId={profile.docId}
            username={profile.username}
            profileId={profile.userId}
            userId={userId}
            loggedInUserDocId={loggedInUserDocId}
          />
        ))}
      </div>
    </motion.div>
  ) : null;
};

Suggestion.proptype = {
  userId: propTypes.string,
  following: propTypes.array,
  loggedInuserDocId: propTypes.string,
};

export default Suggestion;
