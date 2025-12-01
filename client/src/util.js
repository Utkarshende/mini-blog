export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    localStorage.removeItem('user');
    return null;
  }
};

export const getToken = () => {
  const t = localStorage.getItem('token');
  return t ? t.replace(/"/g, '') : null;
};
