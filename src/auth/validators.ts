import * as yup from "yup";

export const validateEmail = yup.string().email().max(100).required();
export const validatePassword = yup.string().min(8).max(64).required();
export const validateFirstName = yup.string().max(50).required();
export const validateLastName = yup.string().max(50).required();
export const validateUuid = yup.string().uuid().required();
