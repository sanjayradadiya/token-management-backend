export interface VerifyOtpInput {
  otp: string;
  token: string;
}

export type LoginUserInput = {
  mobileNumber: string;
  otp: string;
};

export interface VerifyOtpandpasswordInput {
  password: string;
  otp: string;
  token: string;
}

export type LoginBusinessInput = {
  mobileNumber: string;
  otp: string;
};
