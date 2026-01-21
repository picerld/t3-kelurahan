import { z } from "zod";

export const loginFormSchema = z.object({
    email: z.string({
        message: "Email tidak boleh kosong"
    }).email({
        message: "Email tidak valid"
    }),
    password: z.string({
        message: "Password tidak boleh kosong"
    }).min(8, {
        message: "Password harus minimal 8 karakter"
    }),
    rememberMe: z.boolean().default(false),
});