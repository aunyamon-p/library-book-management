const BASE_URL = "http://localhost:3001";


async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.token ? { Authorization: "Bearer " + options.token } : {}),
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }

  return res.json();
}

/**
 * @param {string} username
 * @param {string} password
 */

export const login = (username, password) => {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
};


export const logout = () => {
  localStorage.removeItem("token");
};

export const getBooks = () => {
  const token = localStorage.getItem("token");
  return request("/api/books", { token });
};

/**
 * เพิ่มหนังสือใหม่ (ต้อง login)
 * @param {object} book
 */
export const addBook = (book) => {
  const token = localStorage.getItem("token");
  return request("/api/books", {
    method: "POST",
    token,
    body: JSON.stringify(book),
  });
};

/**
 * แก้ไขหนังสือ
 * @param {number} id
 * @param {object} book
 */
export const updateBook = (id, book) => {
  const token = localStorage.getItem("token");
  return request(`/api/books/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(book),
  });
};

/**
 * ลบหนังสือ
 * @param {number} id
 */
export const deleteBook = (id) => {
  const token = localStorage.getItem("token");
  return request(`/api/books/${id}`, {
    method: "DELETE",
    token,
  });
};

export const getMembers = () => {
  const token = localStorage.getItem("token");
  return request("/api/members", { token });
};

export const addMember = (member) => {
  const token = localStorage.getItem("token");
  return request("/api/members", {
    method: "POST",
    token,
    body: JSON.stringify(member),
  });
};

export const updateMember = (id, member) => {
  const token = localStorage.getItem("token");
  return request(`/api/members/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(member),
  });
};

export const deleteMember = (id) => {
  const token = localStorage.getItem("token");
  return request(`/api/members/${id}`, {
    method: "DELETE",
    token,
  });
};

export const getAdmins = () => {
  const token = localStorage.getItem("token");
  return request("/api/admin", { token });
};

export const addAdmin = (admin) => {
  const token = localStorage.getItem("token");
  return request("/api/admin", {
    method: "POST",
    token,
    body: JSON.stringify(admin),
  });
};

export const updateAdmin = (id, admin) => {
  const token = localStorage.getItem("token");
  return request(`/api/admin/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(admin),
  });
};

export const deleteAdmin = (id) => {
  const token = localStorage.getItem("token");
  return request(`/api/admin/${id}`, {
    method: "DELETE",
    token,
  });
};

export const getBorrows = () => {
  const token = localStorage.getItem("token");
  return request("/api/borrow", { token });
};

export const addBorrow = (borrow) => {
  const token = localStorage.getItem("token");
  return request("/api/borrow", {
    method: "POST",
    token,
    body: JSON.stringify(borrow),
  });
};

export const updateBorrow = (id, borrow) => {
  const token = localStorage.getItem("token");
  return request(`/api/borrow/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(borrow),
  });
};

export const deleteBorrow = (id) => {
  const token = localStorage.getItem("token");
  return request(`/api/borrow/${id}`, {
    method: "DELETE",
    token,
  });
};

export const getDashboard = () => {
  const token = localStorage.getItem("token");
  return request("/api/dashboard", { token });
};

export const getCategories = () => {
  const token = localStorage.getItem("token");
  return request("/api/categories", { token });
};

export const addCategory = (category) => {
  const token = localStorage.getItem("token");
  return request("/api/categories", {
    method: "POST",
    token,
    body: JSON.stringify(category),
  });
};

export const updateCategory = (id, category) => {
  const token = localStorage.getItem("token");
  return request(`/api/categories/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(category),
  });
};

export const deleteCategory = (id) => {
  const token = localStorage.getItem("token");
  return request(`/api/categories/${id}`, {
    method: "DELETE",
    token,
  });
};

export const getReturns = () => {
  const token = localStorage.getItem("token");
  return request("/api/returns", { token });
};

export const addReturn = (returnData) => {
  const token = localStorage.getItem("token");
  return request("/api/returns", {
    method: "POST",
    token,
    body: JSON.stringify(returnData),
  });
};

export const updateReturn = (id, returnData) => {
  const token = localStorage.getItem("token");
  return request(`/api/returns/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(returnData),
  });
};

export const deleteReturn = (id) => {
  const token = localStorage.getItem("token");
  return request(`/api/returns/${id}`, {
    method: "DELETE",
    token,
  });
};

export const getReturnDetails = () => {
  const token = localStorage.getItem("token");
  return request("/api/return-details", { token });
};

export const addReturnDetail = (detail) => {
  const token = localStorage.getItem("token");
  return request("/api/return-details", {
    method: "POST",
    token,
    body: JSON.stringify(detail),
  });
};

export const updateReturnDetail = (id, detail) => {
  const token = localStorage.getItem("token");
  return request(`/api/return-details/${id}`, {
    method: "PUT",
    token,
    body: JSON.stringify(detail),
  });
};

export const deleteReturnDetail = (id, book_id) => {
  const token = localStorage.getItem("token");
  return request(`/api/return-details/${id}`, {
    method: "DELETE",
    token,
    body: JSON.stringify({ book_id }), 
  });
};
