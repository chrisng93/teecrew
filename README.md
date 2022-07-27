# Tee Crew

## Running locally
1. Add your dependencies with the following command: `yarn install`
1. Create a .env file with the following structure:
```
DATABASE_URL=
```
1. Create a .env.local file with the following structure:
```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```
1. Install postgres and run it locally. Run migrations using the following command: `npx prisma generate && npx prisma migrate dev`
1. Run the app with the following command: `npm run dev`
