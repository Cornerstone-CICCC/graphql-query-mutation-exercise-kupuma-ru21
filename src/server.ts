import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { v4 as uuidv4 } from "uuid";

let products = [
  { id: "1", productName: "Apple", price: 3.99, qty: 2 },
  { id: "2", productName: "Banana", price: 1.99, qty: 3 },
  { id: "3", productName: "Orange", price: 2.0, qty: 4 },
  { id: "4", productName: "Mango", price: 5.5, qty: 5 },
  { id: "5", productName: "Watermelon", price: 8.99, qty: 2 },
];

const typeDefs = `#graphql
  type Product {
    id: ID!,
    productName: String,
    price: Float,
    qty: Int
  }

  type Query {
    products: [Product],
    getProductById(id: ID): Product,
    # multiply product price with its qty
    getProductTotalPrice(id: ID): Float,
    # sum of all qty of all products
    getTotalQtyOfProducts: Int
  }

  type Mutation {
    addProduct(productName: String, price: Float, qty: Int): Product,
    updateProduct(id: ID, productName: String, price: Float, qty: Int): Product
    deleteProduct(id: ID): Product
  }
`;

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    products: () => products,
    getProductById: (_, args: { id: string }) => {
      return products.find((product) => product.id === args.id);
    },
    getProductTotalPrice: (_, args: { id: string }) => {
      const product = products.find((product) => product.id === args.id);
      return product.price * product.qty;
    },
    getTotalQtyOfProducts: () => {
      return products.reduce((acc, product) => acc + product.qty, 0);
    },
  },
  Mutation: {
    addProduct: (_, args: Omit<Product, "id">) => {
      const newProduct = {
        id: uuidv4(),
        productName: args.productName,
        price: args.price,
        qty: args.qty,
      };
      products.push(newProduct);
      return newProduct;
    },
    updateProduct: (_, args: Product) => {
      const productIndex = products.findIndex(
        (product) => product.id === args.id
      );
      if (productIndex !== -1) {
        products[productIndex] = args;
        return args;
      }
      return null;
    },
    deleteProduct: (_, args: { id: string }) => {
      const productIndex = products.findIndex(
        (product) => product.id === args.id
      );
      if (productIndex !== -1) {
        const deletedProduct = products[productIndex];
        products = products.filter((product) => product.id !== args.id);
        return deletedProduct;
      }
      return null;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);

type Product = {
  id: string;
  productName: string;
  price: number;
  qty: number;
};
