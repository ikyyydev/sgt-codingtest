"use client";

import React, { useState } from "react";
import { Button, Flex, Form, Input, Typography } from "antd";
import Link from "next/link";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/common/lib/firebase";
import { useRouter } from "next/navigation";

type FieldType = {
  email: string;
  password: string;
};

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);
  const [signinWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await signinWithEmailAndPassword(email, password);
      router.push("/products");
      console.log({ response });
      sessionStorage.setItem("user", "true");
      setEmail("");
      setPassword("");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error:", error, error.message);
      } else {
        console.error("Unknown error:", error);
      }
    }
  };

  return (
    <Flex style={{ height: "100vh" }} justify="center" align="center">
      <Form
        name="basic"
        wrapperCol={{ span: 24 }}
        style={{
          maxWidth: 600,
          border: "1px solid #ccc",
          padding: "50px 20px",
          borderRadius: "10px",
        }}
        initialValues={{ remember: true }}
        autoComplete="off"
        onFinish={handleLogin}
      >
        <Form.Item<FieldType>
          name="email"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input
            placeholder="Email"
            type="email"
            size="large"
            style={{
              width: "100%",
            }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Item>

        <Form.Item<FieldType>
          name="password"
          rules={[
            { required: true, message: "Please input your password!" },
            { min: 6, message: "Password must be at least 6 characters!" },
          ]}
        >
          <Input.Password
            placeholder="Password"
            type="password"
            size="large"
            style={{ width: "100%" }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Item>

        <Form.Item label={null}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginTop: "10px" }}
            size="large"
            block
            loading={loading}
          >
            Login
          </Button>
        </Form.Item>

        <Form.Item label={null}>
          <Typography.Text
            type="secondary"
            style={{ textAlign: "center", display: "block" }}
          >
            Dont have an account? <Link href="/register">Register</Link>
          </Typography.Text>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default Login;
