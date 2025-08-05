@echo off
echo 🚀 Demarrage du serveur et test de livraison
echo.

echo 📡 Demarrage du serveur en arriere-plan...
start /B npm run dev

echo ⏳ Attendre 10 secondes que le serveur demarre...
timeout /t 10 /nobreak

echo 📦 Creation des commandes de test...
node test-delivery-example.js

echo.
echo ✅ Test termine ! 
echo 📋 Ouvrez http://localhost:5173 et allez au Dashboard Hotel
echo 🔑 Connectez-vous avec n'importe quel nom d'utilisateur/mot de passe
echo 📋 Dans "Commandes clients", vous verrez les commandes à livrer
echo.
echo 🔄 Appuyez sur une touche pour arreter le serveur...
pause
taskkill /f /im node.exe 2>nul
echo Serveur arrete.