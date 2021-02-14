import Axios from "axios";

const URL = "https://hotel-harrison-v2.herokuapp.com/";

const clienteAxios = Axios.create({
  baseURL: URL,
});

export default clienteAxios;
