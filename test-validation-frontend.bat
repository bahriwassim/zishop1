@echo off
echo 🧪 Test de Validation Frontend
echo =============================
echo.

echo 📡 Verification que le serveur tourne...
powershell -Command "try { (Invoke-WebRequest -Uri http://localhost:5000/api/products -UseBasicParsing).StatusCode } catch { 'Non accessible' }" | findstr "200" >nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Serveur backend non accessible
    echo 🚀 Demarrage du serveur...
    start /B npm run dev
    echo ⏳ Attendre 10 secondes...
    timeout /t 10 /nobreak
) else (
    echo ✅ Serveur backend accessible
)

echo 📦 Creation de produits de test si necessaire...
node test-product-validation.js

echo.
echo 🌐 Ouverture de la page de test...
start http://localhost:5173/test-validation

echo.
echo ✅ Page de test ouverte !
echo.
echo 📋 INSTRUCTIONS DE TEST:
echo =============================
echo 1. La page de test devrait s'ouvrir automatiquement
echo 2. Ouvrez les outils de developpement (F12)
echo 3. Cliquez sur les boutons "Approuver" et "Rejeter"
echo 4. Observez les logs dans la console
echo 5. Verificiez les messages de toast
echo.
echo 🔍 SI CA NE FONCTIONNE PAS:
echo - Verifiez s'il y a des erreurs dans la console (F12)
echo - Verifiez que les produits s'affichent
echo - Verifiez que les clics sur boutons declenchent des actions
echo.
echo 🔄 Appuyez sur une touche pour continuer...
pause