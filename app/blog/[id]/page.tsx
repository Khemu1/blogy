import React from "react";

interface Props {
  params: { id: number };
}
const Blog: React.FC<Props> = ({ params: { id } }) => {
  return <div>Blog {id}</div>;
};

export default Blog;
