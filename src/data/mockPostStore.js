import initialPosts from "./mockPosts.json";

const STORAGE_KEY = "social-media-scheduler-posts";

const readStoredPosts = () => {
  const storedPosts = window.localStorage.getItem(STORAGE_KEY);
  if (!storedPosts) return [];

  let parsedPosts;
  try {
    parsedPosts = JSON.parse(storedPosts);
  } catch (error) {
    throw new Error("Saved posts could not be read from browser storage.", {
      cause: error,
    });
  }

  if (
    !Array.isArray(parsedPosts) ||
    parsedPosts.some(
      (post) =>
        !post ||
        typeof post.id !== "string" ||
        typeof post.summary !== "string" ||
        !post.platforms ||
        typeof post.platforms !== "object" ||
        Array.isArray(post.platforms) ||
        typeof post.scheduledAt !== "string" ||
        typeof post.status !== "string",
    )
  ) {
    throw new Error("Saved posts in browser storage have an invalid format.");
  }

  return parsedPosts;
};

let storedPosts = readStoredPosts();
let posts = [...initialPosts, ...storedPosts];
let nextPostId =
  Math.max(
    0,
    ...posts.map((post) => Number(post.id)).filter(Number.isFinite),
  ) + 1;
const listeners = new Set();

export const getMockPosts = () => posts;

export const subscribeToMockPosts = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const addMockPost = (post) => {
  const newPost = { ...post, id: String(nextPostId) };
  const nextStoredPosts = [...storedPosts, newPost];

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextStoredPosts));
  storedPosts = nextStoredPosts;
  posts = [...posts, newPost];
  nextPostId += 1;
  listeners.forEach((listener) => listener());
  return newPost;
};

export const updateMockPost = (postId, updates) => {
  const postExists = posts.some((post) => post.id === postId);
  if (!postExists) {
    throw new Error(`Post ${postId} could not be found.`);
  }

  const nextPosts = posts.map((post) =>
    post.id === postId ? { ...post, ...updates } : post,
  );
  const nextStoredPosts = storedPosts.map((post) =>
    post.id === postId ? { ...post, ...updates } : post,
  );

  if (nextStoredPosts.some((post, index) => post !== storedPosts[index])) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextStoredPosts));
    storedPosts = nextStoredPosts;
  }

  posts = nextPosts;
  listeners.forEach((listener) => listener());
  return posts.find((post) => post.id === postId);
};
