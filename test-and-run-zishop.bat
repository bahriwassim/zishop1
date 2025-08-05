@echo off
echo ==============================================
echo   LANCEMENT DES TESTS COMPLETS ZISHOP
echo ==============================================
echo.

echo [1/4] Verification de Node.js...
node --version
if %errorlevel% neq 0 (
    echo ERREUR: Node.js n'est pas installe
    pause
    exit /b 1
)

echo [2/4] Installation des dependances...
npm install
if %errorlevel% neq 0 (
    echo ERREUR: Installation des dependances echouee
    pause
    exit /b 1
)

echo [3/4] Demarrage du serveur en arriere-plan...
start /b npm run dev

echo Attente du demarrage du serveur (10 secondes)...
timeout /t 10 /nobreak > nul

echo [4/4] Execution des tests complets...
echo.
echo ========================================
echo   TESTS EN COURS D'EXECUTION...
echo ========================================
echo.

node test-complete-zishop-scenarios.js

echo.
echo ========================================
echo   TESTS TERMINES
echo ========================================
echo.

echo Appuyez sur une touche pour fermer...
pause > nul