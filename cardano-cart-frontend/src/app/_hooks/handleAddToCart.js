import { useRouter } from "next/navigation";

const handleAddToCart = () => {
  const router = useRouter();

  const handleShowDetails = (id) => {
    addItem({ id: id, name, price, image });
    onAddToCart(`${name} added to cart successfully!`);
  };

  return { handleShowDetails };
};

export default handleAddToCart;
