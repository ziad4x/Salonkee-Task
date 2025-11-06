import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Input from "../../../components/ui/Input";
import { setCredentials } from "../../../store/authSlice";
import AuthServices from "../../../services/auth/authServices";

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            const res = await AuthServices.Login(data);
            dispatch(setCredentials(res));
            localStorage.setItem("token", res.token);
            navigate("/");
        } catch (error) {
            console.error("Login failed:", error);
        }
    };
console.log("BASE_URL:", import.meta.env.VITE_API_BASE_URL);

    return (
        <div className="flex w-full min-h-screen items-center justify-center  px-sm md:px-md lg:px-0 bg-gradient-to-br from-pri/50 via-sec/90 to-thd/40 relative">
            {/* <div className="absolute inset-0 backdrop-blur-2xl bg-blue-200/10 z-7 " /> */}
            <div className="w-full  lg:max-w-2xl bg-white backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/40 flex flex-col gap-6 relative z-[9999]">

                <h1 className="text-3xl font-bold text-center text-pri">
                    Salon Admin Login
                </h1>
                <p className="text-center text-gray-600 text-sm">
                    Welcome back 👋 Please enter your credentials
                </p>


                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 mt-2">
                    <Input
                        label="Email"
                        type="email"
                        {...register("email")}
                        error={errors.email?.message}
                    />

                    <Input
                        label="Password"
                        type="password"
                        {...register("password")}
                        error={errors.password?.message}
                    />

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 cursor-pointer rounded-xl bg-gradient-to-r from-pri to-thd hover:from-thd hover:to-pri text-white font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02]"
                    >
                        {isSubmitting ? "Logging in..." : "Login"}
                    </button>
                </form>


                <p className="text-center text-sm text-gray-500 mt-2">
                    Forgot your password?{" "}
                    <span className="text-pri hover:underline cursor-pointer">
                        Reset here
                    </span>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
