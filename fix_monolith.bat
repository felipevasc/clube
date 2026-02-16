@echo off
echo Stopping any running node processes...
taskkill /F /IM node.exe >nul 2>&1

echo Cleaning modules...
rmdir /s /q node_modules
rmdir /s /q services\api\node_modules
rmdir /s /q services\api\dist

echo Installing dependencies...
call pnpm install

echo Generating Prisma Client...
cd services\api
call npx prisma generate

echo initializing Database...
if not exist dev.db2 (
    echo Creating new database...
    call npx prisma migrate dev --name init_monolith
) else (
    echo Database exists, deploying migrations...
    call npx prisma migrate deploy
)

echo Seeding database...
call npx tsx src/seed.ts

echo Starting API...
start "Clube API" cmd /k "npm run dev"

echo Starting Web...
cd ..\..\apps\web
start "Clube Web" cmd /k "npm run dev"

echo Done!
pause
