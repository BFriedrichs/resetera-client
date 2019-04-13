import produce from "immer";
import ensure from "utils/ensure";
import { ACTIONS } from "./constants";

const initialState = {
  threads: {},
  idMapped: {},
  isFetching: false,
  imageCache: {}
};

const thread = (state = initialState, action) => {
  return produce(state, draft => {
    const threadId = action.data && action.data.threadId;
    const forumId =
      (action.data && action.data.forumId) || state.idMapped[threadId];
    const page = action.data && action.data.page;
    const id = action.data && action.data.id;

    switch (action.type) {
      case ACTIONS.FETCH_THREAD_LINKS_REQUEST:
      case ACTIONS.FETCH_THREAD_REQUEST:
        draft.isFetching = true;
        break;
      case ACTIONS.FETCH_THREAD_LINKS_SUCCESS:
        ensure(draft.threads, forumId, {});
        action.data.threads.forEach((t, i) => {
          t.order = i;
          t.page = page;
          draft.threads[forumId][t.id] = t;
          draft.idMapped[t.id] = forumId;
        });
        draft.isFetching = false;
        break;
      case ACTIONS.FETCH_THREAD_LINKS_FAILURE:
      case ACTIONS.FETCH_THREAD_FAILURE:
        draft.isFetching = false;
        break;
      case ACTIONS.FETCH_THREAD_SUCCESS:
        ensure(draft.threads, forumId);
        ensure(draft.threads[forumId], threadId);
        draft.threads[forumId][threadId].meta = action.data.meta;
        draft.idMapped[threadId] = forumId;
        draft.isFetching = false;
        break;
      case ACTIONS.FETCH_POSTS_REQUEST:
        draft.isFetching = true;
        break;
      case ACTIONS.FETCH_POSTS_SUCCESS:
        ensure(draft.threads, forumId);
        ensure(draft.threads[forumId], threadId);
        ensure(draft.threads[forumId][threadId], "posts", []);

        action.data.posts.forEach(p => {
          p["page"] = page;
        });
        const ids = draft.threads[forumId][threadId].posts.map(e => e.id);

        draft.threads[forumId][threadId].posts.push(
          ...action.data.posts.filter(e => !(e.id in ids))
        );
        draft.threads[forumId][threadId].meta = {
          ...action.data.meta
        };
        draft.threads[forumId][threadId].poll = action.data.poll;
        draft.threads[forumId][threadId].id = id;
        draft.idMapped[threadId] = forumId;
        draft.isFetching = false;
        break;
      case ACTIONS.FETCH_POSTS_FAILURE:
        draft.isFetching = false;
        break;
      case ACTIONS.ADD_TO_IMAGE_CACHE:
        draft.imageCache[action.data.url] = { size: action.data.size };
        break;
    }
  });
};

export default thread;
