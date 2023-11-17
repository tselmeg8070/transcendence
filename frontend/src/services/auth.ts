import API from "./api";

type LoginCredentials = {
  email: string;
  password: string;
};

type UserRegistration = {
  lastName: string;
  firstName: string;
  email: string;
  password: string;
};

const AuthService = {
  loginCredentials: async (email: string, password: string): Promise<any> => {
    try {
      const response = await API.post("/auth/loginCredentials", {
        email,
        password
      });
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  check2FA: async (otp: string, token: string): Promise<any> => {
    try {
      const response = await API.post("/auth/loginVia2FA", {
        token: token,
		twofactorcode: otp,
      });
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  },

  register: async (data: UserRegistration): Promise<any> => {
    try {
      const response = await API.post("/auth/register", {
        lastName: data.lastName,
		firstName: data.firstName,
		email: data.email,
		password: data.password,
      });
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  }
};

export default AuthService;
