const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'server', 'storage.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Corrections pour les hôtels
content = content.replace(/qrCode:/g, 'qr_code:');
content = content.replace(/isActive:/g, 'is_active:');

// Corrections pour les commerçants
content = content.replace(/reviewCount:/g, 'review_count:');
content = content.replace(/isOpen:/g, 'is_open:');
content = content.replace(/imageUrl:/g, 'image_url:');

// Corrections pour les produits
content = content.replace(/merchantId:/g, 'merchant_id:');
content = content.replace(/isAvailable:/g, 'is_available:');
content = content.replace(/isSouvenir:/g, 'is_souvenir:');
content = content.replace(/validationStatus:/g, 'validation_status:');
content = content.replace(/rejectionReason:/g, 'rejection_reason:');
content = content.replace(/validatedAt:/g, 'validated_at:');
content = content.replace(/validatedBy:/g, 'validated_by:');

// Corrections pour les clients
content = content.replace(/firstName:/g, 'first_name:');
content = content.replace(/lastName:/g, 'last_name:');
content = content.replace(/isActive:/g, 'is_active:');
content = content.replace(/hasCompletedTutorial:/g, 'has_completed_tutorial:');

// Corrections pour les commandes
content = content.replace(/hotelId:/g, 'hotel_id:');
content = content.replace(/merchantId:/g, 'merchant_id:');
content = content.replace(/clientId:/g, 'client_id:');
content = content.replace(/orderNumber:/g, 'order_number:');
content = content.replace(/customerName:/g, 'customer_name:');
content = content.replace(/customerRoom:/g, 'customer_room:');
content = content.replace(/totalAmount:/g, 'total_amount:');
content = content.replace(/merchantCommission:/g, 'merchant_commission:');
content = content.replace(/zishopCommission:/g, 'zishop_commission:');
content = content.replace(/hotelCommission:/g, 'hotel_commission:');
content = content.replace(/deliveryNotes:/g, 'delivery_notes:');
content = content.replace(/confirmedAt:/g, 'confirmed_at:');
content = content.replace(/deliveredAt:/g, 'delivered_at:');
content = content.replace(/estimatedDelivery:/g, 'estimated_delivery:');
content = content.replace(/pickedUp:/g, 'picked_up:');
content = content.replace(/pickedUpAt:/g, 'picked_up_at:');

// Corrections pour les utilisateurs
content = content.replace(/entityId:/g, 'entity_id:');

// Ajouter les champs manquants pour les hôtels
content = content.replace(/(qr_code: "[^"]+",\s+is_active: true,)/g, '$1\n      created_at: new Date(),\n      updated_at: new Date(),');

// Ajouter les champs manquants pour les commerçants
content = content.replace(/(image_url: "[^"]+",)/g, '$1\n      created_at: new Date(),\n      updated_at: new Date(),');

// Ajouter les champs manquants pour les produits
content = content.replace(/(validated_by: null,)/g, '$1\n      created_at: new Date(),\n      updated_at: new Date(),');

// Ajouter les champs manquants pour les clients
content = content.replace(/(has_completed_tutorial: false,)/g, '$1\n      created_at: new Date(),\n      updated_at: new Date(),');

// Ajouter les champs manquants pour les commandes
content = content.replace(/(picked_up_at: null,)/g, '$1\n      created_at: new Date(),\n      updated_at: new Date(),');

// Ajouter les champs manquants pour les utilisateurs
content = content.replace(/(entity_id: null,)/g, '$1\n      created_at: new Date(),\n      updated_at: new Date(),');

fs.writeFileSync(filePath, content, 'utf8');
console.log('✅ Erreurs de linter corrigées dans server/storage.ts'); 