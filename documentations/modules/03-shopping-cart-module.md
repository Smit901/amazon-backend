
# Shopping Cart Module

## Technical Tasks

1. **Design and Implement Shopping Cart System:**
   - **Description:** Design and implement a shopping cart system that allows users to add, remove, and update items.

2. **Add, Remove, and Update Items:**
   - **Description:** Allow users to interact with their shopping cart by adding, removing, or updating the quantity of items.

3. **Calculate Total Price:**
   - **Description:** Implement the functionality to calculate the total price of items in the cart.

## API Endpoints

1. **Add Item to Cart**
   - **Endpoint:** `/api/cart/add`
   - **Method:** POST
   - **Request Body:**

     ```json
     {
       "product_id": "12345",
       "quantity": 2
     }
     ```

   - **Response:**
     - 200 OK - Item added to the cart successfully.
     - 400 Bad Request - Invalid input or product not found.

2. **Remove Item from Cart**
   - **Endpoint:** `/api/cart/remove`
   - **Method:** POST
   - **Request Body:**

     ```json
     {
       "product_id": "12345"
     }
     ```

   - **Response:**
     - 200 OK - Item removed from the cart successfully.
     - 400 Bad Request - Invalid input or product not found.

3. **Update Item Quantity in Cart**
   - **Endpoint:** `/api/cart/update`
   - **Method:** POST
   - **Request Body:**

     ```json
     {
       "product_id": "12345",
       "quantity": 3
     }
     ```

   - **Response:**
     - 200 OK - Item quantity updated in the cart successfully.
     - 400 Bad Request - Invalid input or product not found.

4. **Get Cart Contents**
   - **Endpoint:** `/api/cart`
   - **Method:** GET
   - **Response:**

     ```json
     {
       "cart_items": [
         {
           "product_id": "12345",
           "product_name": "Product 1",
           "quantity": 2,
           "price_per_unit": 19.99
         },
         {
           "product_id": "67890",
           "product_name": "Product 2",
           "quantity": 1,
           "price_per_unit": 29.99
         }
       ],
       "total_price": 69.97
     }
     ```

     - 200 OK - Cart contents retrieved successfully.
     - 404 Not Found - Cart is empty.

5. **Checkout**
   - **Endpoint:** `/api/cart/checkout`
   - **Method:** POST
   - **Response:**
     - 200 OK - Order placed successfully. Redirect to payment gateway.
     - 400 Bad Request - Invalid cart or empty cart.

## Database Schema

- **Cart Table**
  - `id` (Primary Key, Auto-generated)
  - `user_id` (Foreign Key to User)
  - `product_id` (Foreign Key to Product)
  - `quantity` (Integer)
  - `created_at` (Timestamp)
  - `updated_at` (Timestamp)

- **Cart Item Table (Join table linking Cart and Product)**
  - `id` (Primary Key, Auto-generated)
  - `cart_id` (Foreign Key to Cart)
  - `product_id` (Foreign Key to Product)
  - `quantity` (Integer)
  
- **Product Table**
  - `id` (Primary Key, Auto-generated)
  - `name` (String)
  - `description` (Text)
  - `price` (Decimal)
  - `created_at` (Timestamp)
  - `updated_at` (Timestamp)

## Additional Details

- Ensure that the cart is associated with a user, and users can only interact with their own carts.
- Implement proper error handling for constious scenarios such as invalid input or product not found.
- Consider implementing security measures to prevent tampering with cart data, such as session-based authentication.
- Integrate with a payment gateway for order checkout and payment processing.
- Handle scenarios where products become unavailable or their prices change between adding to the cart and checkout.
