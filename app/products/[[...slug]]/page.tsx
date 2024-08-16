import React from "react";

const ProductPage: React.FC<{
  params: { slug: string[] };
  searchParams: { sortOrder: string };
}> = ({ params: { slug }, searchParams: { sortOrder } }) => {
  return (
    <div>
      Product Page {slug} , query {sortOrder}
    </div>
  );
};

export default ProductPage;
