import { createContext, useContext, useEffect, useState } from "react";

const ShopContext = createContext();

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(() => {
    return JSON.parse(localStorage.getItem("shopCart") || "[]");
  });

  const [wishlist, setWishlist] = useState(() => {
    return JSON.parse(localStorage.getItem("shopWishlist") || "[]");
  });

  useEffect(() => {
    localStorage.setItem("shopCart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("shopWishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  function addToCart(product) {
    setCart((oldCart) => {
      const found = oldCart.find((item) => item.id === product.id);

      if (found) {
        return oldCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...oldCart, { ...product, quantity: 1 }];
    });
  }

  function removeFromCart(id) {
    setCart((oldCart) => oldCart.filter((item) => item.id !== id));
  }

  function changeQuantity(id, amount) {
    setCart((oldCart) =>
      oldCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function toggleWishlist(product) {
    setWishlist((oldList) =>
      oldList.some((item) => item.id === product.id)
        ? oldList.filter((item) => item.id !== product.id)
        : [...oldList, product]
    );
  }

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        addToCart,
        removeFromCart,
        changeQuantity,
        toggleWishlist,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  return useContext(ShopContext);
}