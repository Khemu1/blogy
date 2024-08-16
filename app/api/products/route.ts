import { NextRequest, NextResponse } from "next/server";
import { getProductModel } from "@/models/product";
import { connectDB } from "@/utils/database";
import {
  newProductSchmea,
  validateWithSchema,
} from "@/middlewares/products/newProduct";
import { ProductProps } from "@/types";
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const Product = await getProductModel();
    const products = await Product.findAll();
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = newProductSchmea().safeParse(body);
    if (!validationResult.success) {
      const { errors } = validateWithSchema(newProductSchmea(), body);
      console.log(errors);
      return NextResponse.json(
        { message: "Validation failed", errors },
        { status: 400 }
      );
    }
    await connectDB();
    const Product = await getProductModel();
    let newPrice: number | string = validationResult.data.price.toFixed(2);
    newPrice = parseFloat(newPrice);

    const productInstance = await Product.create({
      ...validationResult.data,
      price: newPrice,
    });
    const newProduct: ProductProps = productInstance.toJSON();
    return NextResponse.json(newProduct, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Something went wrong", { status: 500 });
  }
}
