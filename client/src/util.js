export const getCurrentUser = () => {
  const user = localStorage.getItem("loggedInUser");
  return user ? JSON.parse(user) : null;
};

export const saveCurrentUser = (user) => {
  localStorage.setItem("loggedInUser", JSON.stringify(user));
  localStorage.setItem("token", user.token);
};

export const logoutUser = () => {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("token");
};
