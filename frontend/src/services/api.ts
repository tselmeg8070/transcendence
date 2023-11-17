import axios from "axios";
import Cookie from "js-cookie";
import { PUBLIC_BACKEND_URL } from "$env/static/public";

// Create a instance of axios to use the same base url.
const axiosAPI = axios.create({
	baseURL: PUBLIC_BACKEND_URL
});

axiosAPI.interceptors.response.use(
	(response) => response,
	(error) => {
	  const status = error.response ? error.response.status : null;
	  console.log(error, status);

	  // Remove token and redirect
	  if (status === 403) {
		Cookie.remove("access_token");
		window.location.reload();
	  }
	  return Promise.reject(error.response);
	}
);

const apiRequest = async (method: string, url: any, request: any) => {
	const headers = {
		authorization: `Bearer ${Cookie.get("access_token")}`
	}
	try {
		const res = await axiosAPI({
			method,
			url,
			data: request,
			headers
		});
		return await Promise.resolve(res.data);
	} catch (err) {
		return await Promise.reject(err);
	}
};

// function to execute the http get request
const get = (url: any, request: any) => apiRequest("get", url, request);

// function to execute the http delete request
const deleteRequest = (url: any, request: any) => apiRequest("delete", url, request);

// function to execute the http post request
const post = (url: any, request: any) => apiRequest("post", url, request);

// function to execute the http put request
const put = (url: any, request: any) => apiRequest("put", url, request);

// function to execute the http path request
const patch = (url: any, request: any) => apiRequest("patch", url, request);

// expose your method to other services or actions
const API = {
	get,
	delete: deleteRequest,
	post,
	put,
	patch
};
export default API;
