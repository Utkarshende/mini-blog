export const saveCurrentUser = (user) => {
  localStorage.setItem("loggedInUser", JSON.stringify(user));
  localStorage.setItem("token", user.token);
};

export const logoutUser = () => {
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("token");
};

export const getCurrentUser = () => {
  const user = localStorage.getItem("loggedInUser");

  if (!user || user === "undefined" || user === "null") {
    return null;
  }

  try {
    return JSON.parse(user);
  } catch (error) {
    console.error("Error parsing loggedInUser:", error);
    return null;
  }
};
