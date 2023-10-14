# User Authentication Module

## Database Schema

### User Table

The User table is responsible for storing user data.

| Field            | Type         | Description                                           |
| ---------------- | ------------ | ----------------------------------------------------- |
| `id` (Primary Key)| Integer      | Auto-generated unique identifier for the user.       |
| `email` (Unique)  | String (Email)| User's email address (must be unique).                |
| `password`       | String (Hashed Password)| Securely hashed user password.                |
| `first_name`     | String       | User's first name.                                   |
| `last_name`      | String       | User's last name.                                    |
| `profile_picture`| String (File path or URL)| Path or URL to the user's profile picture.  |
| `created_at`     | Timestamp    | Timestamp indicating when the user account was created. |
| `updated_at`     | Timestamp    | Timestamp indicating when the user account was last updated. |

## API Endpoints

### 1. User Registration

- **Endpoint:** `/api/auth/register`
- **Method:** POST
- **Description:** Allows users to register for a new account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "first_name": "John",
  "last_name": "Doe",
  "profile_picture": "profile.jpg"
}
```

## 2. Email Verification

- **Endpoint:** `/api/auth/verify/:verification_token`
- **Method:** GET
- **Description:** Verifies the user's email address using a unique verification token.

**Response:**

- `200 OK` - Email verified successfully.
- `400 Bad Request` - Invalid or expired verification token.

## 3. User Login

- **Endpoint:** `/api/auth/login`
- **Method:** POST
- **Description:** Allows users to log in to their accounts.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response:**
- `200 OK`` - Login successful (Returns a JWT token).
- `401 Unauthorized`` - Invalid credentials.

## 4. User Profile

- **Endpoint:** `/api/users/:user_id`
- **Method:** GET (Retrieve), PUT (Update), DELETE (Delete)
- **Description:** Manages user profiles, including updating profile information and deleting user accounts.

**Request Body (Update):**
```json
{
  "first_name": "Updated First Name",
  "last_name": "Updated Last Name",
  "profile_picture": "updated_profile.jpg"
}
```

**Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "profile_picture": "profile.jpg",
  "created_at": "2023-09-15T12:00:00Z",
  "updated_at": "2023-09-16T09:30:00Z"
}
```

## Additional Details

- Passwords should be securely hashed using a strong hashing algorithm (e.g., bcrypt) before storing them in the database.
- Registration should generate a unique verification token and send an email to the user's provided email address with a verification link.
- JWT (JSON Web Tokens) can be used for authentication. Upon successful login, the server should issue a JWT token that the client includes in subsequent requests.
- For security, implement rate limiting, CAPTCHA, and other security measures to prevent brute force attacks.
- Profile pictures can be stored in a separate folder or cloud storage, and the path or URL can be stored in the database.
