import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const path = "http://localhost:8001/products/api/web/v1/products";

export async function GET(
  req: NextRequest,
  { params }: { params: { product_id: string } }
) {
  const id = params.product_id;

  if (!id) {
    return NextResponse.json(
      { error: "Product ID not provided" },
      { status: 400 }
    );
  }

  try {
    const res = await axios.get(`${path}/${id}`);
    return NextResponse.json(res.data, {
      status: res.status,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("Unknown error:", error);
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await axios.post(path, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return NextResponse.json(res.data, {
      status: res.status,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      console.error("Unknown error:", error);
      return NextResponse.json(
        { error: "An unknown error occurred" },
        { status: 500 }
      );
    }
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { product_id: string } }
) {
  const id = params.product_id;
  const body = await req.json();
  try {
    const res = await axios.put(`${path}/${id}`, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Failed to update product", details: error },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { product_id: string } }
) {
  const id = params.product_id;

  if (!id) {
    return NextResponse.json({ error: "Missing product ID" }, { status: 400 });
  }

  try {
    const res = await axios.delete(`${path}/${id}`);
    return NextResponse.json(res.data, {
      status: res.status,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete product", details: error },
      { status: 500 }
    );
  }
}
