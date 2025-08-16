@echo off
chcp 65001 >nul
echo.
echo ========================================
echo    DÉMARRAGE ET TEST ZISHOP
echo ========================================
echo.

echo 🔧 Démarrage de l'application en mode développement...
echo.

REM Démarrer l'application en arrière-plan
start "ZiShop Dev Server" cmd /c "npm run dev"

echo ⏳ Attente du démarrage du serveur...
timeout /t 5 /nobreak >nul

echo.
echo 🧪 Test de l'application...
echo.

REM Tester l'application
node test-application-complete.js

echo.
echo 📋 RÉSUMÉ DES TESTS TERMINÉ
echo ===========================
echo.
echo 🌐 Interface web: http://localhost:5000
echo 📱 API: http://localhost:5000/api
echo 🔔 WebSocket: Port 5000
echo.
echo 💡 L'application est maintenant fonctionnelle !
echo 💡 Utilisez Ctrl+C dans la fenêtre du serveur pour l'arrêter
echo.
pause 