import clienteAxios from "../config/AxiosConfig";

const getGuestTypes = async () => {
  const resp = await clienteAxios.get("/tipos-huesped");
  return resp.data;
};


export { getGuestTypes };
