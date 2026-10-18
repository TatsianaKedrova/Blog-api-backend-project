export const userEmailRegex = new RegExp(
  "^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$",
);
export const userLoginRegex = new RegExp("^[a-zA-Z0-9_-]*$");
export const urlBlogsRegex = new RegExp(
  "^(https?:\/\/)?(www\.)?([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$",
);
