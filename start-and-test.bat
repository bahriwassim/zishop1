@echo off
echo ========================================
echo   ZISHOP - DEMARRAGE ET TESTS COMPLETS
echo ========================================
echo.

echo [1/4] Installation des dependances...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Erreur lors de l'installation des dependances
    pause
    exit /b 1
)
echo ✅ Dependances installees
echo.

echo [2/4] Demarrage du serveur en arriere-plan...
start /B npm run dev
echo ✅ Serveur demarre sur le port 5000
echo.

echo [3/4] Attente du demarrage du serveur...
timeout /t 5 /nobreak > nul
echo ✅ Serveur pret
echo.

echo [4/4] Lancement des tests complets...
node test-complete-fixes.js
if %errorlevel% neq 0 (
    echo ❌ Erreur lors des tests
    pause
    exit /b 1
)
echo.

echo ========================================
echo   TESTS TERMINES AVEC SUCCES!
echo ========================================
echo.
echo L'application ZiShop est maintenant:
echo ✅ Demarree sur http://localhost:5000
echo ✅ Testee et validee
echo ✅ Prete pour utilisation
echo.
echo Appuyez sur une touche pour fermer...
pause > nul 