@echo off
setlocal
echo ==========================================
echo CLUBE FIX SCRIPT V3 (Workspace Detach)
echo ==========================================

echo [1/8] Stopping Node processes...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM prisma.exe 2>nul
echo.

echo [2/8] Detaching workspace (Rename root package.json)...
cd c:\dev\clube
if exist package.json rename package.json package.json.root_bak
if not exist package.json.root_bak (
    if not exist package.json (
        echo WARNING: package.json not found in root? Proceeding carefully...
    )
)

echo [3/8] Cleaning Users service...
cd services\users
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo [4/8] Installing local dependencies (npm)...
echo This avoids workspace protocol errors.
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo FAIL: npm install failed.
    goto :restore
)

echo [5/8] Generating Prisma Client...
call npx prisma generate
if %ERRORLEVEL% NEQ 0 (
    echo FAIL: Prisma generation failed.
    goto :restore
)

echo [6/8] Cleaning up npm artifacts...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

:restore
echo [7/8] Restoring workspace...
cd c:\dev\clube
if exist package.json.root_bak rename package.json.root_bak package.json

echo [8/8] Relinking with pnpm...
call npx pnpm install --filter @clube/users --force

echo.
echo ==========================================
echo Fix sequence complete.
echo 1. If "Generate Prisma Client" succeeded above, you are good.
echo 2. Run 'npm run dev' to start.
echo.
echo NOTE: If package.json is missing in root, rename package.json.root_bak back to package.json manually.
echo ==========================================
pause
