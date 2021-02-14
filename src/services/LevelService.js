import clienteAxios from "../config/AxiosConfig";

const getLevels = async () => {
  const resp = await clienteAxios.get("/niveles");
  return resp.data;
};

export { getLevels };
