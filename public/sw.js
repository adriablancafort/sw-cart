const API_URL = "http://api.brickoram.com/v1/";
const INDEXDB_VERSION = 1;

// Install Service Worker
self.addEventListener("install", () => {
    self.skipWaiting();
});

// Activate Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    new Promise((resolve, reject) => {
      const openRequest = indexedDB.open("localdb", INDEXDB_VERSION);

      openRequest.onupgradeneeded = event => {
        let db = event.target.result;

        // Create Object Stores: cart
        db.createObjectStore("cart", { keyPath: "id" });
      };

      openRequest.onsuccess = () => resolve();
      openRequest.onerror = () => reject();
    })

    // Take control of all pages under this service worker"s scope
    .then(() => {
      self.clients.claim();
    })
)});

// Get cart items
const getCart = () => {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open("localdb", INDEXDB_VERSION);

    openRequest.onsuccess = (event) => {
      let db = event.target.result;
      let transaction = db.transaction(["cart"], "readonly");
      let cartStore = transaction.objectStore("cart");
      let itemsRequest = cartStore.getAll();

      itemsRequest.onsuccess = () => resolve(itemsRequest.result);
      itemsRequest.onerror = () => reject();
    };
    openRequest.onerror = () => reject();
  });
}

const setCart = (item) => {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open("localdb", INDEXDB_VERSION);

    openRequest.onsuccess = (event) => {
      let db = event.target.result;
      let transaction = db.transaction(["cart"], "readwrite");
      let cartStore = transaction.objectStore("cart");
      let cartRequest = cartStore.get("cart");

      cartRequest.onsuccess = () => {
        let cart = cartRequest.result;
        if (!cart) {
          // If the cart does not exist, create it
          cart = { id: "cart", open: true, count: 0, subtotal: 0, items: [] };
        }

        // Look for the item in the cart
        let itemIndex = cart.items.findIndex(cartItem => cartItem.id === item.id);
        if (itemIndex === -1) {
          // If the item does not exist, add it
          cart.items.push(item);
        } else {
          // If the item exists, update its quantity
          cart.items[itemIndex].quantity += item.quantity;
        }

        // Update the count and subtotal
        cart.count += item.quantity;
        cart.subtotal += item.price * item.quantity;

        // Update the cart in the object store
        let updateCartRequest = cartStore.put(cart);
        updateCartRequest.onsuccess = () => resolve();
        updateCartRequest.onerror = () => reject();
      };
      cartRequest.onerror = () => reject();
    };
    openRequest.onerror = () => reject();
  });
};

const deleteFromCart = (item) => {
  return new Promise((resolve, reject) => {
    const openRequest = indexedDB.open("localdb", INDEXDB_VERSION);

    openRequest.onsuccess = (event) => {
      let db = event.target.result;
      let transaction = db.transaction(["cart"], "readwrite");
      let objectStore = transaction.objectStore("cart");
      let cartRequest = objectStore.get("cart");
      
      cartRequest.onsuccess = () => {
        let cart = cartRequest.result;
        if (!cart) {
          // The cart does not exist
          reject();
        }

        // Look for the item in the cart
        let itemIndex = cart.items.findIndex(cartItem => cartItem.id === item.id);
        if (itemIndex === -1) {
          reject();
        } else {
          // Remove the item from the cart
          let item = cart.items[itemIndex];
          cart.items.splice(itemIndex, 1);

          // Update the cart count and subtotal
          cart.count -= item.quantity;
          cart.subtotal -= item.price * item.quantity;

          // Update the cart in the object store
          let updateCartRequest = objectStore.put(cart, "cart");
          updateCartRequest.onsuccess = () => resolve();
          updateCartRequest.onerror = () => reject();
        }
      };
      cartRequest.onerror = () => reject();
    };
    openRequest.onerror = () => reject();
  });
};

self.addEventListener("fetch", (event) => {
  
  // Get cart items
  if ((event.request.url === API_URL + "carts") && (event.request.method === "GET")) {
    event.respondWith(
      getCart().then((items) => {
        console.log("get cart items from sw" , items);
        return new Response(JSON.stringify(items));
      })
    );
  }

  // Add item to cart
  else if ((event.request.url === API_URL + "carts") && (event.request.method === "POST")) {
    event.respondWith(
      event.request.json().then((item) => {
        setCart(item);
        return new Response(null);
      })
    );
  }

  // Change item quantity
  else if ((event.request.url === API_URL + "carts") && (event.request.method === "PUT")) {
    event.respondWith(
      event.request.json().then((item) => {
        setCart(item);
        return new Response(null);
      })
    );
  }

  // Delete item from cart
  else if ((event.request.url === API_URL + "carts") && (event.request.method === "DELETE")) {
    event.respondWith(
      event.request.json().then((item) => {
        deleteFromCart(item);
        return new Response(null);
      })
    );
  }
});