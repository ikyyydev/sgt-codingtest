"use client";

import React from "react";
import type { FormProps } from "antd";
import { Button, Flex, Form, Input, Typography } from "antd";

type FieldType = {
  email: string;
  password: string;
};

const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
  console.log("Success:", values);
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const Login = () => {
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
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
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
          />
        </Form.Item>

        <Form.Item<FieldType>
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            placeholder="Password"
            type="password"
            size="large"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item label={null}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginTop: "10px" }}
            size="large"
            block
          >
            Login
          </Button>
        </Form.Item>

        <Form.Item label={null}>
          <Typography.Text
            type="secondary"
            style={{ textAlign: "center", display: "block" }}
          >
            Don&apos;t have an account? <a href="/register">Register</a>
          </Typography.Text>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default Login;
