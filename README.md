# Silver Rose Hardware  

## Setup  

### 1. Install Dependencies  
Run the following command to install all required dependencies:  
```sh
npm install --legacy-peer-deps
```  

### 2. Create a `.env` File  
Create a `.env` file in the project root and add the following environment variables:  
```ini
AUTH_SECRET=
DATABASE_URL=
UPLOADTHING_TOKEN=
```  

#### Environment Variables Explained:  

- **`AUTH_SECRET`** – A secret key used for authentication. You can generate a secure string using OpenSSL it the git terminal:  
  ```sh
  openssl rand -hex 32
  ```  

- **`DATABASE_URL`** – Your PostgreSQL database connection string. Use the following format:  
  ```
  postgresql://<username>:<password>@<host>:<port>/postgres
  ```
  Replace `<username>`, `<password>`, `<host>`, and `<port>` with your actual database credentials.

- **`UPLOADTHING_TOKEN`** – An API token for UploadThing. To obtain this:  
  1. Create an account on [UploadThing](https://uploadthing.com).  
  2. Set up a project.  
  3. Copy your token and paste it into the `.env` file.  

---

### Next Steps  
After configuring the .env file, generate the Prisma client and apply migrations to set up the database schema:  
```sh
npx prisma generate
npx prisma db push
```  
This ensures Prisma is properly set up before you start the server. Let me know if you need any refinements!



After setting up your environment, you can start the development server:  
```sh
npm run dev
```  
### Creating first user
Now we'll create our first admin user. Navigate to `http://localhost:3000/admin/create-first-user`
- **NOTE:** After creating the first admin user, this page will not be accessible anymore, unless you clear the database. Please be careful and do not forget your admin credentials.
