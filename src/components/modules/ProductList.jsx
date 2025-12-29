import React from "react";
import { List } from "react-window";

function ProductList({ products }) {
  return (
    <List
      height={500}           // Height of the container
      itemCount={products.length}
      itemSize={120}         // Height for each product card
      width={"100%"}
    >
      {({ index, style }) => {
        const product = products[index];
        return (
          <div style={style} className="p-4 border-b flex items-center gap-3">
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 object-cover rounded"
            />

            <div>
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-gray-600">₹{product.price}</p>
            </div>
          </div>
        );
      }}
    </List>
  );
}

export default ProductList;