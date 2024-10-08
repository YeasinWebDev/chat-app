"use client";
import React from 'react'
import {
    EmailOutlined,
    LockOutlined,
    PersonOutline,
} from "@mui/icons-material";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {signIn} from 'next-auth/react'

const Form = ({ type }) => {

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm();

    const router = useRouter();


    const onSubmit = async (data) => {
        if (type === "signup") {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                router.push("/");
            }

            if (res.error) {
                toast.error("Something went wrong");
            }
        }

        if (type === "signin") {
            const res = await signIn("credentials", {
                ...data,
                redirect: false,
            })

            if (res.ok) {
                router.push("/chats");
            }

            if (res.error) {
                toast.error("Invalid email or password");
            }
        }
    };

    return (
        <div className='auth'>
            <div className="content">
                <div className='flex items-center justify-center gap-3'>
                    <img className='w-12' src="/assets/logo.svg" alt="" />
                    <h1 className='font-semibold text-xl '>Chatify</h1>
                </div>

                <form className="form" onSubmit={handleSubmit(onSubmit)}>
                    {type === "signup" && (
                        <div>
                            <div className="input">
                                <input
                                    defaultValue=""
                                    {...register("username", {
                                        required: "Username is required",
                                        validate: (value) => {
                                            if (value.length < 3) {
                                                return "Username must be at least 3 characters";
                                            }
                                        },
                                    })}
                                    type="text"
                                    placeholder="Username"
                                    className="input-field"
                                />
                                <PersonOutline sx={{ color: "#737373" }} />
                            </div>
                            {errors.username && (
                                <p className="text-red-600">{errors.username.message}</p>
                            )}
                        </div>
                    )}

                    <div>
                        <div className="input">
                            <input
                                defaultValue=""
                                {...register("email", { required: "Email is required" })}
                                type="email"
                                placeholder="Email"
                                className="input-field"
                            />
                            <EmailOutlined sx={{ color: "#737373" }} />
                        </div>
                        {errors.email && (
                            <p className="text-red-600">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <div className="input">
                            <input
                                defaultValue=""
                                {...register("password", {
                                    required: "Password is required",
                                    validate: (value) => {
                                        if (
                                            value.length < 5 
                                        ) {
                                            return "Password must be at least 5 characters";
                                        }
                                    },
                                })}
                                type="password"
                                placeholder="Password"
                                className="input-field"
                            />
                            <LockOutlined sx={{ color: "#737373" }} />
                        </div>
                        {errors.password && (
                            <p className="text-red-600">{errors.password.message}</p>
                        )}
                    </div>

                    <button className="button" type="submit">
                        {type === "signup" ? "Join Free" : "Let's Chat"}
                    </button>
                </form>
                {type === "signup" ? (
                    <Link href="/" className="link">
                        <p className="text-center">Already have an account? Sign In Here</p>
                    </Link>
                ) : (
                    <Link href="/signup" className="link">
                        <p className="text-center">Don't have an account? Register Here</p>
                    </Link>
                )}
            </div>
        </div>
    )
}

export default Form