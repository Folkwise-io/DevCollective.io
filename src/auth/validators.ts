import * as yup from "yup";

export const validateEmail = yup.string().email().max(100).lowercase().trim().required().strict();
export const validatePassword = yup.string().min(8).max(64).required().strict();
export const validateFirstName = yup.string().max(50).required().strict();
export const validateLastName = yup.string().max(50).required().strict();
export const validateUuid = yup.string().uuid().required().strict();
