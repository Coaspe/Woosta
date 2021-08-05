import { FieldValue, firebase, storageRef } from "../lib/firebase";

export async function doesUsernameExist(username) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("username", "==", username)
    .get();

  return result.docs.length > 0;
}
export async function getUserByUsername(username) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("username", "==", username)
    .get();

  return result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));
}
export async function getUserByUserId(userId) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("userId", "==", userId)
    .get();
  const user = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));
  return user;
}
export async function deletePhotos(DocId) {
  await firebase
    .firestore()
    .collection("photos")
    .doc(DocId)
    .delete()
    .then((res) => console.log(res));
}
export async function getSuggestedProfiles(userId, following) {
  const result = await firebase.firestore().collection("users").limit(10).get();
  return result.docs
    .map((user) => ({ ...user.data(), docId: user.id }))
    .filter(
      (profile) =>
        profile.userId !== userId && !following.includes(profile.userId)
    );
}

//  updateLoggedInUserFollowing, updateFollowedUserFollowers

export async function updateLoggedInUserFollowing(
  loggedInUserDocId,
  profileId,
  isFollowingProfile
) {
  return firebase
    .firestore()
    .collection("users")
    .doc(loggedInUserDocId)
    .update({
      // Already following remove ! Add following
      following: isFollowingProfile
        ? FieldValue.arrayRemove(profileId)
        : FieldValue.arrayUnion(profileId),
    });
}
export async function updateFollowedUserFollowers(
  profileDocId, //currently logged in user document id
  loggedInUserDocId, // the user that someone requests to follow
  isFollowingProfile
) {
  return firebase
    .firestore()
    .collection("users")
    .doc(profileDocId)
    .update({
      followers: isFollowingProfile
        ? FieldValue.arrayRemove(loggedInUserDocId)
        : FieldValue.arrayUnion(loggedInUserDocId),
    });
}

export async function getPhotos(userId, following) {
  //get firestore docs that someone follows
  const result1 = await firebase
    .firestore()
    .collection("photos")
    .where("userId", "in", following)
    .get();
  const result2 = await firebase
    .firestore()
    .collection("photos")
    .where("userId", "==", userId)
    .get();
  const result = result1.docs.concat(result2.docs);
  const userFollowedPhotos = result.map((photo) => ({
    ...photo.data(),
    docId: photo.id,
  }));
  // promise는 평범하게 사용할 때, 한 번에 한 개만 await 할 수 있다.
  // 두개를 동시에 받아올 수 있어야 하는데 순차적으로 가져오게 된다.
  // 그것을 해결하기 위해 promise의 배열을 promise.all로 보낸다.
  // promise 배열 안에 있는 모든 구성원 promise들이 resolved 될 때 비로소 resolve 한다.
  // async는 promise를 return하고 await는 promise를 기다린다.(await함수는 일반적으로 promise가 된다.)
  const photosWithUserDetails = await Promise.all(
    userFollowedPhotos.map(async (photo) => {
      let userLikedPhoto = false;
      if (photo.likes.includes(userId)) {
        userLikedPhoto = true;
      }
      // photo.userId = 2
      const user = await getUserByUserId(photo.userId);
      // raphael
      const { username } = user[0]; // first user
      return { username, ...photo, userLikedPhoto };
    })
  );
  return photosWithUserDetails;
}

export async function getUserPhotosByUsername(username) {
  const [user] = await getUserByUsername(username);
  const result = await firebase
    .firestore()
    .collection("photos")
    .where("userId", "==", user.userId)
    .get();

  return result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));
}

export async function isUserFollowingProfile(
  loggedInUserUsername,
  profileUserId
) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("username", "==", loggedInUserUsername)
    .where("following", "array-contains", profileUserId)
    .get();
  const [response = {}] = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));

  return response.userId;
}
export async function uploadImage(caption, ImageUrl, userInfo) {
  const result = await storageRef
    .child(`${userInfo.email}/${ImageUrl.name}`)
    .put(ImageUrl);

  const imageAccessToken = await storageRef
    .child(`${userInfo.email}/${ImageUrl.name}`)
    .getDownloadURL();

  await firebase.firestore().collection("photos").add({
    caption: caption,
    comments: [],
    dateCreated: Date.now(),
    imageSrc: imageAccessToken,
    photoId: ImageUrl.name,
    likes: [],
    userId: userInfo.uid,
  });
}
export async function getImage(ImagePath) {
  await storageRef
    .child(ImagePath)
    .getDownloadURL()
    .then((url) => {
      console.log(url);
    });
}
export async function toggleFollow(
  isFollowingProfile,
  activeUserDocId,
  profileDocId,
  profileUserId,
  followingUserId
) {
  // 1st param: karl's doc id
  // 2nd param: raphel's doc id
  // 3rd param: is the user following this profile? e.g. does karl follow raphael? (true/false)
  await updateLoggedInUserFollowing(
    activeUserDocId,
    profileUserId,
    isFollowingProfile
  );
  // 1st param: karl's doc id
  // 2nd param: raphael's doc id
  // 3rd param: is the user following this profile? e.g. does karl follow raphael? (true/false)
  await updateFollowedUserFollowers(
    profileDocId,
    followingUserId,
    isFollowingProfile
  );
}
export async function getUserProflieImg(usercon) {
  const user = await getUserByUserId(usercon.uid);
  const { profileImg } = user[0];
  return profileImg;
}

export async function getUserProflieImgByUsername(username) {
  const user = await getUserByUsername(username);
  const { profileImg } = user[0];
  return profileImg;
}
