# Transetu API

A full-featured Node.js/Express API with search, sort, pagination, file uploads, and more.

## Features

- 🔍 Full-text search across products
- 📊 Sorting and filtering
- 📄 Pagination
- 📁 File uploads to MongoDB/GridFS
- 🔐 User authentication
- 🌍 Environment-based configuration

## Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   cd Backend
   npm install
   ```

3. Create `.env` file from example:
   ```bash
   cp .env.example .env
   ```
   Update variables in `.env` with your values.

4. Start development server:
   ```bash
   npm run dev
   ```

## Deployment on Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`

4. Add Environment Variables in Render Dashboard:
   - `PORT`: Will be provided by Render
   - `NODE_ENV`: production
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: Your JWT secret key

5. Deploy! Render will automatically build and deploy your app.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 4000 |
| MONGO_URI | MongoDB connection URL | mongodb://localhost:27017/transetu_exercises |
| JWT_SECRET | JWT signing key | Required in production |
| NODE_ENV | Environment | development |

## API Endpoints

### Products API
- `GET /api/products` - Get products with search/sort/filter
  - Query params:
    - search: Text search in name/description
    - sort: Field to sort by
    - order: asc/desc
    - page: Page number
    - limit: Items per page
- `POST /api/products` - Create product

### File Upload API
- `POST /upload` - Upload file
- `GET /files/:filename` - Get uploaded file

### User API
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/users` - Get users (admin)