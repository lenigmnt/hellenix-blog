import api from "./api";

const categoryService = {
  getAll: async () => {
    const res = await api.get("/categories");
    return res.data.data.categories;
  },
};

export default categoryService;
