#  Foody – MERN Stack Food Delivery Application

A full-stack food delivery web application built using the **MERN Stack (MongoDB, Express.js, React.js, and Node.js)**. It allows users to explore food products, manage their cart, place orders, make online payments, and track their orders.

The application also includes admin and rider management features to manage products, orders, and delivery operations.

- **GitHub Repository:** https://github.com/nitinbhoria090/foody-fullstack.git

##  Features

###  User Features
- User registration and login.
- Secure authentication using JWT.
- Browse food products and categories.
- Search and explore available food items.
- Add and remove products from the cart.
- Manage delivery addresses.
- Place food orders.
- Online payment integration using Razorpay.
- View order history.
- Track order status in real time.

###  Admin Features
- Admin authentication and authorization.
- Add, update, and delete food products.
- Manage product categories.
- Manage customer orders.
- Update order status.
- Manage riders and delivery operations.

###  Rider Features
- Rider management.
- View assigned orders.
- Update delivery status.
- Track the delivery process.

###  Additional Features
- RESTful API architecture.
- Image uploads using Cloudinary.
- Real-time communication using Socket.IO.
- Responsive user interface.
- Protected routes and role-based authorization.

## Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend development |
| JavaScript (ES6+) | Programming language |
| Tailwind CSS | UI styling |
| Node.js | Backend runtime |
| Express.js | Backend framework |
| MongoDB | NoSQL database |
| Mongoose | Database modeling |
| JWT | Authentication |
| bcryptjs | Password hashing |
| Cloudinary | Image storage |
| Razorpay | Online payment integration |
| Socket.IO | Real-time order tracking |
| Axios | API communication |
| Git & GitHub | Version control |

##  Project Structure

```text
foody-fullstack/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── redux/
│   ├── hooks/
│   ├── assets/
│   └── App.jsx
│
├── public/
├── .gitignore
└── README.md
```

*The structure above is a representative overview; adjust folder names to match your repository.*

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/nitinbhoria090/foody-fullstack.git
```

```bash
cd foody-fullstack
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

Start the backend server:

```bash
npm start
```

### 3. Frontend Setup

Open another terminal and navigate to the frontend directory.

```bash
npm install
```

Create a `.env` file in the frontend root:

```env
VITE_APP_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

### 4. Open the Application

```text
http://localhost:5173
```

## 🔌 Backend API Modules

The backend follows a REST API architecture.

| API Endpoint | Description |
|---|---|
| `/api/auth` | User authentication |
| `/api/users` | User management |
| `/api/products` | Product management |
| `/api/categories` | Category management |
| `/api/cart` | Shopping cart operations |
| `/api/address` | Address management |
| `/api/orders` | Order management |
| `/api/payment` | Payment processing |
| `/api/riders` | Rider management |

## 💳 Payment Integration

The application integrates **Razorpay** to provide online payment functionality.

- Create payment orders.
- Process online payments.
- Integrate the payment flow with food orders.

## 📍 Real-Time Order Tracking

Socket.IO is used for real-time communication between the backend and frontend.

Order status flow:

```text
Confirmed
    ↓
Preparing
    ↓
Out for Delivery
    ↓
Delivered
```

Users can receive updated order status without manually refreshing the page.

## 🔐 Security

- JWT-based authentication.
- Password hashing using bcryptjs.
- Protected API routes.
- Role-based access control.
- Environment variables for sensitive credentials.

## 📸 Screenshots

Add your application screenshots here.

```markdown
![Home Page](./screenshots/home.png)

![Food Products](./screenshots/products.png)

![Shopping Cart](./screenshots/cart.png)

![Order Tracking](./screenshots/orders.png)
```

## 🚀 Future Improvements

- AI-based food recommendations.
- Advanced search and filtering.
- Discount coupons and offers.
- Customer reviews and ratings.
- Improved delivery tracking.

## 👨‍💻 Developer

**Nitin Bhoria**

MERN Stack Developer | Full Stack Web Developer

- GitHub: https://github.com/nitinbhoria090
- LinkedIn: https://www.linkedin.com/in/nitin-bhoria-8b537625a/

---

⭐ If you like this project, don't forget to give it a star!

**Built with ❤️ using the MERN Stack.**
