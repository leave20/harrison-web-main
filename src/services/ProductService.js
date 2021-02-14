import clienteAxios from "../config/AxiosConfig";

const getProducts = async () => {
  const resp = await clienteAxios.get("/productos");
  return resp.data;
};

const getProductById = async (id) => {
  const resp = await clienteAxios.get(`/productos/${id}`);
  return resp.data;
};

const createProduct = async (data) => {
  const resp = await clienteAxios.post("/productos", data);
  return resp.data;
};

const updateProduct = async (data, id) => {
  const resp = await clienteAxios.put(`/productos/${id}`, data);
  return resp.data;
};

export { getProducts, createProduct, getProductById, updateProduct };
