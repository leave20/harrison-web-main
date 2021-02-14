import clienteAxios from "../config/AxiosConfig";

const getDocumentsType = async () => {
  const resp = await clienteAxios.get("/tipos-documento");
  return resp.data;
};


export { getDocumentsType };
