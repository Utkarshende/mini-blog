export const saveCurrentUser = (user) => {
  localStorage.setItem("loggedInUser", JSON.stringify(user));
  localStorage.setItem("token", user.token);
};

export const logoutUser = () => {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("token");
};

export const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

export const getToken = () => {
  return localStorage.getItem("token") || null;
};
