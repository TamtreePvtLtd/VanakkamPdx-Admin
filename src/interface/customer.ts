export interface IAuthContext {
  user: IUser | null;
  updateUserData: (user: IUser | null) => void;
}

export interface ISignUp {
  phoneNumber?: string | null;
  password: string;
  name: string;
  email: string;
  confirmPassword: string;
}

export interface IUser {
  userId: string | null;
  email: string | null;
  name: string | null;
}

export interface ILoginFormInputs {
  email: string;
  password: string;
}

export interface ILoginResponse {
  data: IUser | null;
  message: string;
  status?: boolean;
}
