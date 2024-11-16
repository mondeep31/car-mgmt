

Steps to Set Up the Project

1. Clone the Repository:

```
git clone <repository_url>
cd <repository_directory>
```

2. Install Dependencies:
```
npm install
```

3. Set Up Environment Variables:

Create a .env file in the project root (if it doesn’t exist).

Add the following environment variable:
```
DATABASE_URL="your_mongodb_connection_url"
```


4. Apply Prisma Schema:

Push the Prisma schema to the database:
```
npx prisma db push
```


5. Generate Prisma Client:
```
npx prisma generate
```

6. Start the Development Server:
```
npm run dev
```

Run  ``` npx prisma db ``` push every time the prisma/schema.prisma file is updated to sync the database schema.
