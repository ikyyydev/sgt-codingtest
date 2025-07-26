"use client";

import { auth } from "@/common/lib/firebase";
import { Product } from "@/common/types/products";
import HeaderNav from "@/components/Header";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Space,
  Table,
  Typography,
} from "antd";
import { ColumnsType, TablePaginationConfig } from "antd/es/table";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const Products = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const session = sessionStorage.getItem("user");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [inputText, setInputText] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(5);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit" | "delete">(
    "create"
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3000/api/products", {
        params: {
          search: searchText,
          page: currentPage,
          pageSize,
        },
      });
      setProducts(response.data.data);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [currentPage, searchText, pageSize]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      setSearchText(inputText.toLowerCase());
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [inputText]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchText(inputText);
      setCurrentPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputText]);

  if (!user && !session) {
    router.push("/login");
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      [
        product.product_title,
        product.product_description,
        product.product_category,
      ].some((field) => field?.toLowerCase().includes(searchText))
    );
  }, [products, searchText]);

  const columns: ColumnsType<Product> = [
    {
      title: "Product Title",
      dataIndex: "product_title",
      key: "product_title",
    },
    {
      title: "Category",
      dataIndex: "product_category",
      key: "product_category",
      render: (category: string | undefined) => category || "Uncategorized",
    },
    {
      title: "Description",
      dataIndex: "product_description",
      key: "product_description",
    },
    {
      title: "Price",
      dataIndex: "product_price",
      key: "product_price",
      render: (price: number) => `$${price.toLocaleString("id-ID")}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <span style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => {
              setSelectedProduct(record);
              setModalType("edit");
              setIsModalOpen(true);
            }}
          >
            Edit
          </button>
          <button
            onClick={() => {
              setSelectedProduct(record);
              setModalType("delete");
              setIsModalOpen(true);
            }}
          >
            Delete
          </button>
        </span>
      ),
    },
  ];

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("/api/products", selectedProduct);
      message.success("Product created successfully");
      setIsModalOpen(false);
      setSelectedProduct(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
        message.error(error.message);
      } else {
        console.error("Unknown error:", error);
        message.error("An unknown error occurred");
      }
    }
  };

  const hanleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.put(
        `/api/products/${selectedProduct?.product_id}`,
        selectedProduct
      );
      message.success("Product updated successfully");
      setIsModalOpen(false);
      setSelectedProduct(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
        message.error(error.message);
      } else {
        console.error("Unknown error:", error);
        message.error("An unknown error occurred");
      }
    }
  };

  const handleDeleteProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.delete(`/api/products/${selectedProduct?.product_id}`);
      message.success("Product deleted successfully");
      setIsModalOpen(false);
      setSelectedProduct(null);
      loadProducts();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
        message.error(error.message);
      } else {
        console.error("Unknown error:", error);
        message.error("An unknown error occurred");
      }
    }
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    if (pagination.current) {
      setCurrentPage(pagination.current);
    }
  };

  return (
    <>
      <HeaderNav />

      <div
        style={{
          width: "100%",
          height: "100vh",
          display: "flex",
          gap: "20px",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography.Title level={1} style={{ margin: "10px 0" }}>
          Products
        </Typography.Title>
        <Typography.Paragraph>List of products:</Typography.Paragraph>
        <div
          style={{
            border: "1px solid black",
            padding: "20px",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <Space
            direction="horizontal"
            size="middle"
            style={{
              width: "100%",
              marginBottom: "20px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Input.Search
              placeholder="Search by title, description, or category"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              allowClear
              style={{ width: "300px" }}
            />

            <Button
              onClick={() => {
                setModalType("create");
                setIsModalOpen(true);
              }}
            >
              Create Product
            </Button>
          </Space>
          <Table
            columns={columns}
            dataSource={filteredProducts}
            loading={loading}
            rowKey="product_id"
            bordered
            pagination={{
              current: currentPage,
              pageSize,
              showSizeChanger: false,
            }}
            onChange={handleTableChange}
          />
        </div>

        {/* Modal */}
        <Modal
          open={isModalOpen}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
          onOk={
            modalType === "edit"
              ? hanleEditProduct
              : modalType === "create"
              ? handleCreateProduct
              : handleDeleteProduct
          }
          title={
            modalType === "edit"
              ? "Edit Product"
              : modalType === "create"
              ? "Create Product"
              : "Delete Product"
          }
        >
          {modalType === "edit" && selectedProduct && (
            <Form layout="vertical">
              <Form.Item label="Product Title">
                <Input
                  value={selectedProduct.product_title}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      product_title: e.target.value,
                    })
                  }
                />
              </Form.Item>
              <Form.Item label="Price">
                <Input
                  type="number"
                  value={selectedProduct.product_price}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      product_price: parseFloat(e.target.value),
                    })
                  }
                />
              </Form.Item>
              <Form.Item label="Category">
                <Input
                  value={selectedProduct.product_category || ""}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      product_category: e.target.value,
                    })
                  }
                />
              </Form.Item>
              <Form.Item label="Description">
                <Input.TextArea
                  value={selectedProduct.product_description || ""}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      product_description: e.target.value,
                    })
                  }
                />
              </Form.Item>
            </Form>
          )}

          {modalType === "delete" && selectedProduct && (
            <p>
              Are you sure you want to delete the product{" "}
              <strong>{selectedProduct.product_title}</strong>?
            </p>
          )}
        </Modal>
      </div>
    </>
  );
};

export default Products;
