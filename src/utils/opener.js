export const openThread = (navigation, threadId, page, postId) => {
  const gotoPage = page || 1;
  const currThread = navigation.getParam("threadId", false);
  const currPage = navigation.getParam("page", -1);

  if (currThread == threadId) {
    if (currPage != gotoPage) {
      navigation.setParams({ page: gotoPage, postId });
    } else if (postId) {
      navigation.setParams({ page: gotoPage, postId });
    }
  } else {
    navigation.navigate("Thread", { threadId, page: gotoPage, postId });
  }
};
