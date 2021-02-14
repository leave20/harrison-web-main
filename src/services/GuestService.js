import clienteAxios from "../config/AxiosConfig";

const getGuests = async () => {
  const resp = await clienteAxios.get("/huespedes");
  return resp.data;
};

const getGuestById = async (id) => {
  const resp = await clienteAxios.get(`/huespedes/${id}`);
  return resp.data;
};

const createGuest = async (data) => {
  const resp = await clienteAxios.post("/huespedes", data);
  return resp.data;
};

const updateGuest = async (data, id) => {
  const resp = await clienteAxios.put(`/huespedes/${id}`, data);
  return resp.data;
};

const changeStatusGuest = async (id) => {
    const resp = await clienteAxios.patch(`/huespedes/${id}`);
    return resp.data;
  }; 

export { getGuests, getGuestById, createGuest, updateGuest, changeStatusGuest };
