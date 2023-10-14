
# Order Management Module

## Technical Tasks:

1. **Create Database Schema for Order Details:**
   - **Description:** Create a database schema to store order details, including order items, status, and related information.

2. **Implement Order Placement:**
   - **Description:** Implement the process of placing an order, including selecting products, specifying quantities, and providing shipping and payment details.

3. **Provide Order History and Tracking:**
   - **Description:** Develop functionality that allows users to view their order history and track the status of their orders.

## API Endpoints:

1. **Place an Order**
   - **Endpoint:** `/api/orders/place`
   - **Method:** POST
   - **Request Body:**
     ```json
     {
       "user_id": "12345",
       "items": [
         {
           "product_id": "product-1",
           "quantity": 2
         },
         {
           "product_id": "product-2",
           "quantity": 1
         }
       ],
       "shipping_address": {
         "street": "123 Main St",
         "city": "Cityville",
         "zip_code": "12345"
       },
       "payment_method": "credit_card"
     }
     ```
   - **Response:**
     - 201 Created - Order placed successfully. Returns order details.
     - 400 Bad Request - Invalid input or products not available.

2. **Get Order History**
   - **Endpoint:** `/api/orders/history/:user_id`
   - **Method:** GET
   - **Response:**
     ```json
     {
       "orders": [
         {
           "order_id": "order-1",
           "order_date": "2023-09-16T12:00:00Z",
           "status": "Shipped",
           "total_price": 49.99
         },
         {
           "order_id": "order-2",
           "order_date": "2023-09-15T09:30:00Z",
           "status": "Delivered",
           "total_price": 69.99
         }
       ]
     }
     ```
     - 200 OK - Order history retrieved successfully.
     - 404 Not Found - No orders found for the user.

3. **Track Order Status**
   - **Endpoint:** `/api/orders/track/:order_id`
   - **Method:** GET
   - **Response:**
     ```json
     {
       "order_id": "order-1",
       "status": "Shipped",
       "estimated_delivery_date": "2023-09-20"
     }
     ```
     - 200 OK - Order status retrieved successfully.
     - 404 Not Found - Order not found.

## Database Schema:

- **Order Table**
  - `order_id` (Primary Key, Auto-generated)
  - `user_id` (Foreign Key to User)
  - `order_date` (Timestamp)
  - `status` (String, e.g., "Processing," "Shipped," "Delivered")
  - `total_price` (Decimal)
  - `shipping_address_id` (Foreign Key to Shipping Address)
  - `payment_method` (String, e.g., "credit_card," "paypal")

- **Order Item Table (Join table linking Order and Product)**
  - `order_item_id` (Primary Key, Auto-generated)
  - `order_id` (Foreign Key to Order)
  - `product_id` (Foreign Key to Product)
  - `quantity` (Integer)

- **Shipping Address Table**
  - `address_id` (Primary Key, Auto-generated)
  - `street` (String)
  - `city` (String)
  - `zip_code` (String)

## Additional Details:

- Ensure that orders are associated with the user who placed them.
- Implement validation checks to ensure that products are available and quantities are valid when placing an order.
- Provide estimated delivery dates based on order status.
- Handle scenarios where products become unavailable or their prices change between order placement and fulfillment.
- Implement proper error handling for constious scenarios such as invalid input or order not found.
