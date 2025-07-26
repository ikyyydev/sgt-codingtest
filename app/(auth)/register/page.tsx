"use client";

import React, { useState } from "react";
import { Button, Flex, Form, Input, Typography } from "antd";
import Link from "next/link";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/common/lib/firebase";
import Error from "next/error";

type FieldType = {
  email: string;
  password: string;
  confirmPassword?: string;
};

const Register = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const [createUserAndPassword] = useCreateUserWithEmailAndPassword(auth);

  const handleRegister = async () => {
    setLoading(true);
    try {
      const userCredential = await createUserAndPassword(email, password);
      sessionStorage.setItem("user", "true");
      console.log({ userCredential });
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(" Error: ", error);
      } else {
        console.log("Unknown error:", error);
      }
    } finally {
      setLoading(false);
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

        <Form.Item<FieldType>
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("The passwords do not match!");
              },
            }),
          ]}
        >
          <Input.Password
            placeholder="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Item>

        <Form.Item label={null}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginTop: "10px" }}
            size="large"
            block
            onClick={handleRegister}
            loading={loading}
            disabled={loading}
          >
            Submit
          </Button>
        </Form.Item>

        <Form.Item label={null}>
          <Typography.Text
            type="secondary"
            style={{ textAlign: "center", display: "block" }}
          >
            Already have an account? <Link href="/login">Login</Link>
          </Typography.Text>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default Register;
