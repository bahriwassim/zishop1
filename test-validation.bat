@echo off
echo 🛍️ Test de validation des produits
echo.

echo 📡 Verification que le serveur tourne...
curl -s http://localhost:5000/api/products >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Serveur non accessible. Demarrage...
    start /B npm run dev
    echo ⏳ Attendre 10 secondes que le serveur demarre...
    timeout /t 10 /nobreak
) else (
    echo ✅ Serveur deja accessible
)

echo 📦 Creation des produits de test...
node test-product-validation.js

echo.
echo ✅ Test termine ! 
echo 📋 Ouvrez http://localhost:5173 et allez au Dashboard Admin
echo 🔑 Connectez-vous avec n'importe quel nom d'utilisateur/mot de passe  
echo 📋 Dans "Validation" > "Validation des produits", testez l'approbation
echo.
echo 🔄 Appuyez sur une touche pour continuer...
pause