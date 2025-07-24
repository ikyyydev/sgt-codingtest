"use client";

import React from "react";
import type { FormProps } from "antd";
import { Button, Flex, Form, Input, Typography } from "antd";

type FieldType = {
  email: string;
  password: string;
  confirmPassword?: string;
};

const onFinish: FormProps<FieldType>["onFinish"] = (values) => {
  console.log("Success:", values);
};

const onFinishFailed: FormProps<FieldType>["onFinishFailed"] = (errorInfo) => {
  console.log("Failed:", errorInfo);
};

const Register = () => {
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
                return Promise.reject(new Error("The passwords do not match!"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm Password" />
        </Form.Item>

        <Form.Item label={null}>
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginTop: "10px" }}
            size="large"
            block
          >
            Submit
          </Button>
        </Form.Item>

        <Form.Item label={null}>
          <Typography.Text
            type="secondary"
            style={{ textAlign: "center", display: "block" }}
          >
            Already have an account? <a href="/login">Login</a>
          </Typography.Text>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default Register;
