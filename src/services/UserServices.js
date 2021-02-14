import clienteAxios from "../config/AxiosConfig";

const login = async (data) => {
  const resp = await clienteAxios.post(`/usuarios/login`, data);
  return resp.data;
};

export { login };
