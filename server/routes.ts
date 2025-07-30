import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertHotelSchema, insertMerchantSchema, insertProductSchema, insertOrderSchema, insertClientSchema } from "@shared/schema";
import { authenticateUser, generateToken, requireAuth, requireRole, requireEntityAccess } from "./auth";
import { notificationService } from "./notifications";

export async function registerRoutes(app: Express): Promise<Server> {
  // Hotels
  app.get("/api/hotels", requireAuth, async (req, res) => {
    try {
      const hotels = await storage.getAllHotels();
      res.json(hotels);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hotels" });
    }
  });

  app.get("/api/hotels/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const hotel = await storage.getHotel(id);
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }
      res.json(hotel);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hotel" });
    }
  });

  app.get("/api/hotels/code/:code", async (req, res) => {
    try {
      const code = req.params.code;
      const hotel = await storage.getHotelByCode(code);
      if (!hotel) {
        return res.status(404).json({ message: "Hotel not found" });
      }
      res.json(hotel);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hotel" });
    }
  });

  app.post("/api/hotels", requireAuth, requireRole('admin'), async (req, res) => {
    try {
      console.log("Hotel data with QR:", req.body);
      
      // Clean and prepare hotel data
      const { qrCode, isActive, ...cleanData } = req.body;
      const hotelData = {
        ...cleanData,
        latitude: req.body.latitude?.toString() || "0",
        longitude: req.body.longitude?.toString() || "0"
      };
      
      const validatedData = insertHotelSchema.parse(hotelData);
      const hotel = await storage.createHotel(validatedData);
      res.status(201).json(hotel);
    } catch (error: any) {
      console.error("Error creating hotel:", error);
      res.status(400).json({ message: "Invalid hotel data", error: error.message });
    }
  });

  // Merchants
  app.get("/api/merchants", async (req, res) => {
    try {
      const merchants = await storage.getAllMerchants();
      res.json(merchants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch merchants" });
    }
  });

  app.get("/api/merchants/near/:hotelId", async (req, res) => {
    try {
      const hotelId = parseInt(req.params.hotelId);
      const radius = parseInt(req.query.radius as string) || 3;
      const merchants = await storage.getMerchantsNearHotel(hotelId, radius);
      res.json(merchants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch nearby merchants" });
    }
  });

  app.get("/api/merchants/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const merchant = await storage.getMerchant(id);
      if (!merchant) {
        return res.status(404).json({ message: "Merchant not found" });
      }
      res.json(merchant);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch merchant" });
    }
  });

  app.post("/api/merchants", requireAuth, async (req, res) => {
    try {
      console.log("Received merchant data:", req.body);
      
      // Convert coordinates to strings before validation
      const merchantData = {
        ...req.body,
        latitude: req.body.latitude?.toString() || "0",
        longitude: req.body.longitude?.toString() || "0"
      };
      
      const validatedData = insertMerchantSchema.parse(merchantData);
      const merchant = await storage.createMerchant(validatedData);
      res.status(201).json(merchant);
    } catch (error: any) {
      console.error("Error creating merchant:", error);
      res.status(400).json({ message: "Invalid merchant data", error: error.message });
    }
  });

  // Products
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/merchant/:merchantId", async (req, res) => {
    try {
      const merchantId = parseInt(req.params.merchantId);
      const products = await storage.getProductsByMerchant(merchantId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch merchant products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post("/api/products", requireAuth, async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  app.put("/api/products/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const product = await storage.updateProduct(id, updates);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProduct(id);
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Endpoint pour la validation des produits par l'admin
  app.post("/api/products/:id/validate", requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { action, note } = req.body;
      
      console.log(`Validation produit ${id}: ${action}`, { note });
      
      if (!["approve", "reject"].includes(action)) {
        return res.status(400).json({ message: "Action must be 'approve' or 'reject'" });
      }
      
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Mettre à jour le statut de validation du produit
      const validationStatus = action === 'approve' ? 'approved' : 'rejected';
      const updates = {
        validationStatus,
        rejectionReason: action === 'reject' ? note : null,
        validatedAt: new Date(),
        validatedBy: req.user!.id
      };
      
      const updatedProduct = await storage.updateProduct(id, updates);
      
      // Log de validation pour audit
      console.log(`Produit ${product.name} ${action === 'approve' ? 'approuvé' : 'rejeté'} par admin`, {
        productId: id,
        action,
        note,
        adminId: req.user!.id,
        timestamp: new Date().toISOString()
      });
      
      // TODO: Envoyer une notification au commerçant
      
      res.json({ 
        message: `Product ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
        product: updatedProduct,
        validation: { action, note, timestamp: new Date().toISOString() }
      });
    } catch (error: any) {
      console.error("Error validating product:", error);
      res.status(500).json({ message: "Failed to validate product" });
    }
  });

  // Orders
  app.get("/api/orders", requireAuth, async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/hotel/:hotelId", requireAuth, requireEntityAccess, async (req, res) => {
    try {
      const hotelId = parseInt(req.params.hotelId);
      const orders = await storage.getOrdersByHotel(hotelId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hotel orders" });
    }
  });

  app.get("/api/orders/merchant/:merchantId", requireAuth, requireEntityAccess, async (req, res) => {
    try {
      const merchantId = parseInt(req.params.merchantId);
      const orders = await storage.getOrdersByMerchant(merchantId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch merchant orders" });
    }
  });

  app.get("/api/orders/client/:clientId", async (req, res) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const orders = await storage.getOrdersByClient(clientId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch client orders" });
    }
  });

  app.get("/api/orders/client/:clientId/active", async (req, res) => {
    try {
      const clientId = parseInt(req.params.clientId);
      const orders = await storage.getActiveOrdersByClient(clientId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch active client orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const order = await storage.getOrder(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.post("/api/orders", requireAuth, async (req, res) => {
    try {
      console.log("=== DONNÉES REÇUES PAR LE SERVEUR ===");
      console.log("req.body:", JSON.stringify(req.body, null, 2));
      console.log("=====================================");
      
      const orderData = insertOrderSchema.parse(req.body);
      // Vérification du stock pour chaque produit commandé
      if (!Array.isArray(orderData.items)) {
        return res.status(400).json({ message: "Le champ 'items' doit être un tableau." });
      }
      for (const item of orderData.items) {
        if (!item || typeof item !== 'object' || !('productId' in item) || !('quantity' in item)) {
          return res.status(400).json({ message: "Chaque item doit contenir productId (number) et quantity (number)." });
        }
        const productId = (item as any).productId;
        const quantity = (item as any).quantity;
        if (typeof productId !== "number" || typeof quantity !== "number") {
          return res.status(400).json({ message: "Chaque item doit contenir productId (number) et quantity (number)." });
        }
        const product = await storage.getProduct(productId);
        if (!product) {
          return res.status(400).json({ message: `Produit ID ${productId} introuvable.` });
        }
        if (typeof product.stock !== "number" || product.stock < quantity) {
          return res.status(400).json({ message: `Stock insuffisant pour le produit ${product.name}. Stock actuel: ${product.stock}, demandé: ${quantity}` });
        }
      }
      // Décrémenter le stock de chaque produit
      for (const item of orderData.items) {
        if (item && typeof item === 'object' && 'productId' in item && 'quantity' in item) {
          const productId = (item as any).productId;
          const quantity = (item as any).quantity;
          const product = await storage.getProduct(productId);
          if (product) {
            const currentStock = typeof product.stock === "number" ? product.stock : 0;
            await storage.updateProduct(product.id, { stock: currentStock - quantity });
          }
        }
      }
      // Calculer automatiquement les commissions selon le cahier des charges
      const totalAmount = parseFloat(orderData.total_amount as string);
      const merchantCommission = (totalAmount * 0.75).toFixed(2); // 75%
      const zishopCommission = (totalAmount * 0.20).toFixed(2);   // 20% 
      const hotelCommission = (totalAmount * 0.05).toFixed(2);    // 5%
      // Générer un numéro de commande unique
      const orderNumber = `ZS-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      const enhancedOrderData = {
        ...orderData,
        orderNumber,
        merchantCommission,
        zishopCommission,
        hotelCommission,
        status: "pending", // Statut initial selon le workflow
      };
      const order = await storage.createOrder(enhancedOrderData);
      
      // Send notification about new order
      notificationService.notifyNewOrder(order);
      
      res.status(201).json(order);
    } catch (error) {
      console.error("Erreur création commande:", error);
      res.status(400).json({ message: "Invalid order data" });
    }
  });

  app.put("/api/orders/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      // Validation des transitions de statut selon le workflow
      if (updates.status) {
        const currentOrder = await storage.getOrder(id);
        if (!currentOrder) {
          return res.status(404).json({ message: "Order not found" });
        }
        
        const validTransitions: Record<string, string[]> = {
          "pending": ["confirmed", "cancelled"],
          "confirmed": ["preparing", "cancelled"],
          "preparing": ["ready", "cancelled"],
          "ready": ["delivering", "cancelled"],
          "delivering": ["delivered", "cancelled"],
          "delivered": [], // État final
          "cancelled": [], // État final
        };
        
        const allowedNextStates = validTransitions[currentOrder.status] || [];
        if (!allowedNextStates.includes(updates.status)) {
          return res.status(400).json({ 
            message: `Transition de statut invalide: ${currentOrder.status} → ${updates.status}` 
          });
        }
        
        // Ajouter automatiquement les timestamps appropriés
        if (updates.status === "confirmed" && !updates.confirmedAt) {
          updates.confirmedAt = new Date().toISOString();
        }
        if (updates.status === "delivered" && !updates.deliveredAt) {
          updates.deliveredAt = new Date().toISOString();
        }
      }
      
      const order = await storage.updateOrder(id, updates);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Send notification about order status change
      if (updates.status) {
        const statusMessages: Record<string, string> = {
          "confirmed": "Votre commande a été confirmée par le commerçant",
          "preparing": "Votre commande est en cours de préparation",
          "ready": "Votre commande est prête",
          "delivering": "Votre commande est en cours de livraison",
          "delivered": "Votre commande a été livrée à la réception",
          "cancelled": "Votre commande a été annulée"
        };
        
                 notificationService.notifyOrderUpdate({
           type: 'order_update',
           orderId: order.id,
           orderNumber: order.orderNumber,
           status: updates.status,
           hotelId: order.hotelId,
           merchantId: order.merchantId,
           clientId: order.clientId || undefined,
           message: statusMessages[updates.status] || `Statut de commande mis à jour: ${updates.status}`
         });
      }
      
      res.json(order);
    } catch (error) {
      console.error("Erreur mise à jour commande:", error);
      res.status(500).json({ message: "Failed to update order" });
    }
  });

  // Nouveau endpoint pour obtenir le workflow des commandes
  app.get("/api/orders/workflow", async (req, res) => {
    try {
      const workflow = {
        statuses: [
          {
            id: "pending",
            name: "En attente",
            description: "Commande créée, en attente de confirmation du commerçant",
            color: "#f59e0b",
            nextStates: ["confirmed", "cancelled"]
          },
          {
            id: "confirmed", 
            name: "Confirmée",
            description: "Commande confirmée par le commerçant",
            color: "#3b82f6",
            nextStates: ["preparing", "cancelled"]
          },
          {
            id: "preparing",
            name: "En préparation", 
            description: "Commande en cours de préparation",
            color: "#f97316",
            nextStates: ["ready", "cancelled"]
          },
          {
            id: "ready",
            name: "Prête",
            description: "Commande prête pour livraison",
            color: "#8b5cf6",
            nextStates: ["delivering", "cancelled"]
          },
          {
            id: "delivering",
            name: "En livraison",
            description: "Commande en cours de livraison vers l'hôtel",
            color: "#6366f1", 
            nextStates: ["delivered", "cancelled"]
          },
          {
            id: "delivered",
            name: "Livrée",
            description: "Commande livrée à la réception de l'hôtel",
            color: "#10b981",
            nextStates: []
          },
          {
            id: "cancelled",
            name: "Annulée",
            description: "Commande annulée",
            color: "#ef4444",
            nextStates: []
          }
        ],
        commissionStructure: {
          merchant: { percentage: 75, description: "Commission commerçant" },
          zishop: { percentage: 20, description: "Commission Zishop" },
          hotel: { percentage: 5, description: "Commission hôtel" }
        }
      };
      
      res.json(workflow);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch workflow" });
    }
  });

  // Endpoint pour les statistiques de commissions par période
  app.get("/api/orders/commissions/stats", async (req, res) => {
    try {
      const { period = "today" } = req.query;
      const orders = await storage.getAllOrders();
      
      let filteredOrders = orders;
      const now = new Date();
      
      switch (period) {
        case "today":
          filteredOrders = orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            return orderDate.toDateString() === now.toDateString();
          });
          break;
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          filteredOrders = orders.filter(order => new Date(order.createdAt) >= weekAgo);
          break;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          filteredOrders = orders.filter(order => new Date(order.createdAt) >= monthAgo);
          break;
      }
      
      interface StatsAccumulator {
        totalRevenue: number;
        merchantCommission: number;
        zishopCommission: number;
        hotelCommission: number;
        orderCount: number;
      }
      
      const stats = filteredOrders
        .filter(order => !["cancelled"].includes(order.status))
        .reduce((acc: StatsAccumulator, order) => {
          const total = parseFloat(order.totalAmount);
          acc.totalRevenue += total;
          acc.merchantCommission += total * 0.75;
          acc.zishopCommission += total * 0.20;
          acc.hotelCommission += total * 0.05;
          acc.orderCount++;
          return acc;
        }, {
          totalRevenue: 0,
          merchantCommission: 0,
          zishopCommission: 0,
          hotelCommission: 0,
          orderCount: 0
        } as StatsAccumulator);
      
      // Arrondir les montants
      const keys: (keyof StatsAccumulator)[] = ['totalRevenue', 'merchantCommission', 'zishopCommission', 'hotelCommission'];
      keys.forEach(key => {
        stats[key] = parseFloat(stats[key].toFixed(2));
      });
      
      res.json({
        period,
        stats,
        averageOrderValue: stats.orderCount > 0 ? parseFloat((stats.totalRevenue / stats.orderCount).toFixed(2)) : 0
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch commission stats" });
    }
  });

  // Users management endpoints
  app.get("/api/users", requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Ne pas retourner les mots de passe
      const usersResponse = users.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      res.json(usersResponse);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post("/api/users", requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const userData = req.body;
      console.log("Création d'utilisateur:", userData);
      
      // Validation basique
      if (!userData.username || !userData.password || !userData.role) {
        return res.status(400).json({ message: "Username, password and role are required" });
      }
      
      if (!["admin", "hotel", "merchant"].includes(userData.role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      
      // Pour les rôles hotel et merchant, entityId est requis
      if ((userData.role === "hotel" || userData.role === "merchant") && !userData.entityId) {
        return res.status(400).json({ message: `Entity ID is required for ${userData.role} role` });
      }

      // Vérifier que l'entité existe
      if (userData.role === "hotel") {
        const hotel = await storage.getHotel(userData.entityId);
        if (!hotel) {
          return res.status(400).json({ message: "Hotel not found" });
        }
      } else if (userData.role === "merchant") {
        const merchant = await storage.getMerchant(userData.entityId);
        if (!merchant) {
          return res.status(400).json({ message: "Merchant not found" });
        }
      }
      
      // Créer l'utilisateur dans la base de données
      const newUser = await storage.createUser({
        username: userData.username,
        password: userData.password,
        role: userData.role,
        entityId: userData.entityId || null
      });
      
      // Ne pas retourner le mot de passe
      const { password, ...userResponse } = newUser;
      console.log("Utilisateur créé:", userResponse);
      res.status(201).json(userResponse);
    } catch (error: any) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user", error: error.message });
    }
  });

  // Clients
  app.post("/api/clients/register", async (req, res) => {
    try {
      console.log("Client registration request:", req.body);
      
      const clientData = insertClientSchema.parse(req.body);
      console.log("Validated client data:", clientData);
      
      // Vérifier si l'email existe déjà
      const existingClient = await storage.getClientByEmail(clientData.email);
      if (existingClient) {
        return res.status(400).json({ 
          message: "Un compte avec cet email existe déjà",
          error: "EMAIL_EXISTS"
        });
      }
      
      const client = await storage.createClient(clientData);
      console.log("Client created successfully:", { id: client.id, email: client.email });
      
      // Don't return password in response
      const { password, ...clientResponse } = client;
      res.status(201).json({ client: clientResponse });
    } catch (error: any) {
      console.error("Client registration error:", error);
      
      // Gestion spécifique des erreurs de validation
      if (error.name === 'ZodError') {
        const validationErrors = error.errors.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message
        }));
        
        return res.status(400).json({ 
          message: "Données invalides",
          errors: validationErrors,
          error: "VALIDATION_ERROR"
        });
      }
      
      res.status(400).json({ 
        message: "Erreur lors de la création du compte", 
        error: error.message 
      });
    }
  });

  app.post("/api/clients/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }
      
      const client = await storage.authenticateClient(email, password);
      if (!client) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate token for client session
      const token = generateToken({
        id: client.id,
        username: client.email,
        role: 'client' as any,
        entityId: client.id
      });
      
      // Don't return password in response
      const { password: _, ...clientResponse } = client;
      res.json({ client: clientResponse, token });
    } catch (error) {
      console.error("Client login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.get("/api/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const client = await storage.getClient(id);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      
      // Don't return password in response
      const { password, ...clientResponse } = client;
      res.json(clientResponse);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch client" });
    }
  });

  app.put("/api/clients/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      // Don't allow password updates through this endpoint
      delete updates.password;
      
      const client = await storage.updateClient(id, updates);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      
      // Don't return password in response
      const { password, ...clientResponse } = client;
      res.json(clientResponse);
    } catch (error) {
      res.status(500).json({ message: "Failed to update client" });
    }
  });

  app.get("/api/clients/:id/stats", async (req, res) => {
    try {
      const clientId = parseInt(req.params.id);
      const orders = await storage.getOrdersByClient(clientId);
      
      const totalOrders = orders.length;
      const totalSpent = orders
        .filter(order => !["cancelled", "refunded"].includes(order.status))
        .reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
      const completedOrders = orders.filter(order => order.status === "delivered").length;
      
      // Calculate favorite merchant
      const merchantCounts = orders.reduce((acc, order) => {
        if (order.status === "delivered") {
          acc[order.merchantId] = (acc[order.merchantId] || 0) + 1;
        }
        return acc;
      }, {} as Record<number, number>);
      
      const favoriteMerchantId = Object.keys(merchantCounts).reduce((a, b) => 
        merchantCounts[parseInt(a)] > merchantCounts[parseInt(b)] ? a : b, "0"
      );
      
      let favoriteMerchantName = "Aucun";
      if (favoriteMerchantId !== "0") {
        const merchant = await storage.getMerchant(parseInt(favoriteMerchantId));
        favoriteMerchantName = merchant?.name || "Inconnu";
      }

      res.json({
        totalOrders,
        totalSpent: totalSpent.toFixed(2),
        completedOrders,
        favoriteMerchant: favoriteMerchantName,
        loyaltyPoints: Math.floor(totalSpent * 0.5), // 0.5 points per euro spent
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch client stats" });
    }
  });

  // New customer-specific endpoints (legacy support)
  app.get("/api/orders/customer/:customerName/:customerRoom", async (req, res) => {
    try {
      const { customerName, customerRoom } = req.params;
      const orders = await storage.getOrdersByCustomer(customerName, customerRoom);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer orders" });
    }
  });

  app.get("/api/orders/customer/:customerName/:customerRoom/active", async (req, res) => {
    try {
      const { customerName, customerRoom } = req.params;
      const orders = await storage.getActiveOrdersByCustomer(customerName, customerRoom);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch active customer orders" });
    }
  });

  // Customer profile endpoints (legacy support)
  app.get("/api/customers/:customerName/:customerRoom/stats", async (req, res) => {
    try {
      const { customerName, customerRoom } = req.params;
      const orders = await storage.getOrdersByCustomer(customerName, customerRoom);
      
      const totalOrders = orders.length;
      const totalSpent = orders
        .filter(order => !["cancelled", "refunded"].includes(order.status))
        .reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
      const completedOrders = orders.filter(order => order.status === "delivered").length;
      
      // Calculate favorite merchant
      const merchantCounts = orders.reduce((acc, order) => {
        if (order.status === "delivered") {
          acc[order.merchantId] = (acc[order.merchantId] || 0) + 1;
        }
        return acc;
      }, {} as Record<number, number>);
      
      const favoriteMerchantId = Object.keys(merchantCounts).reduce((a, b) => 
        merchantCounts[parseInt(a)] > merchantCounts[parseInt(b)] ? a : b, "0"
      );
      
      let favoriteMerchantName = "Aucun";
      if (favoriteMerchantId !== "0") {
        const merchant = await storage.getMerchant(parseInt(favoriteMerchantId));
        favoriteMerchantName = merchant?.name || "Inconnu";
      }

      res.json({
        totalOrders,
        totalSpent: totalSpent.toFixed(2),
        completedOrders,
        favoriteMerchant: favoriteMerchantName,
        loyaltyPoints: Math.floor(totalSpent * 0.5), // 0.5 points per euro spent
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch customer stats" });
    }
  });

  // Statistics endpoints
  app.get("/api/stats/hotel/:hotelId", requireAuth, requireEntityAccess, async (req, res) => {
    try {
      const hotelId = parseInt(req.params.hotelId);
      const orders = await storage.getOrdersByHotel(hotelId);
      const todayOrders = orders.filter(order => {
        const today = new Date();
        const orderDate = new Date(order.createdAt);
        return orderDate.toDateString() === today.toDateString();
      });

      const totalRevenue = todayOrders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
      const commission = totalRevenue * 0.05; // 5% for hotel

      res.json({
        todayOrders: todayOrders.length,
        totalRevenue: totalRevenue.toFixed(2),
        commission: commission.toFixed(2),
        activeClients: new Set(todayOrders.map(order => order.customerRoom)).size,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hotel stats" });
    }
  });

  app.get("/api/stats/merchant/:merchantId", requireAuth, requireEntityAccess, async (req, res) => {
    try {
      const merchantId = parseInt(req.params.merchantId);
      const orders = await storage.getOrdersByMerchant(merchantId);
      const products = await storage.getProductsByMerchant(merchantId);
      
      const todayOrders = orders.filter(order => {
        const today = new Date();
        const orderDate = new Date(order.createdAt);
        return orderDate.toDateString() === today.toDateString();
      });

      const dailyRevenue = todayOrders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0) * 0.75; // 75% for merchant

      res.json({
        todayOrders: todayOrders.length,
        activeProducts: products.filter(p => p.isAvailable).length,
        dailyRevenue: dailyRevenue.toFixed(2),
        totalOrders: orders.length,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch merchant stats" });
    }
  });

  app.get("/api/stats/admin", requireAuth, requireRole('admin'), async (req, res) => {
    try {
      const hotels = await storage.getAllHotels();
      const merchants = await storage.getAllMerchants();
      const orders = await storage.getAllOrders();
      
      const todayOrders = orders.filter(order => {
        const today = new Date();
        const orderDate = new Date(order.createdAt);
        return orderDate.toDateString() === today.toDateString();
      });

      const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
      const commission = totalRevenue * 0.20; // 20% for Zishop

      res.json({
        totalHotels: hotels.filter(h => h.isActive).length,
        totalMerchants: merchants.filter(m => m.isOpen).length,
        todayOrders: todayOrders.length,
        activeUsers: todayOrders.length, // Simplified
        totalRevenue: totalRevenue.toFixed(2),
        commission: commission.toFixed(2),
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  // User Registration
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password, role, entityId } = req.body;
      if (!username || !password || !role) {
        return res.status(400).json({ message: "Username, password and role are required" });
      }
      
      if (!["admin", "hotel", "merchant"].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // For hotel and merchant roles, entityId is required
      if ((role === "hotel" || role === "merchant") && !entityId) {
        return res.status(400).json({ message: `Entity ID is required for ${role} role` });
      }

      // Verify entity exists
      if (role === "hotel") {
        const hotel = await storage.getHotel(entityId);
        if (!hotel) {
          return res.status(400).json({ message: "Hotel not found" });
        }
      } else if (role === "merchant") {
        const merchant = await storage.getMerchant(entityId);
        if (!merchant) {
          return res.status(400).json({ message: "Merchant not found" });
        }
      }
      
      // Create user
      const newUser = await storage.createUser({
        username,
        password,
        role,
        entityId: entityId || null
      });
      
      // Don't return password
      const { password: _, ...userResponse } = newUser;
      res.status(201).json({ user: userResponse });
    } catch (error: any) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed", error: error.message });
    }
  });

  // User Authentication
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      
      // BYPASS AUTHENTICATION FOR TESTING - Accept any username/password
      console.log(`[TEST MODE] Login attempt for user: ${username}`);
      
      // Create fake user based on username
      let role: 'admin' | 'hotel' | 'merchant' | 'client' = 'client';
      let entityId = 1;
      
      if (username.toLowerCase().includes('admin')) {
        role = 'admin';
      } else if (username.toLowerCase().includes('hotel')) {
        role = 'hotel';
        entityId = 1;
      } else if (username.toLowerCase().includes('merchant')) {
        role = 'merchant';
        entityId = 1;
      }
      
      const fakeUser = {
        id: 1,
        username: username,
        role: role,
        entityId: entityId
      };
      
      const token = generateToken(fakeUser);
      
      // Get associated entity data based on user role
      let entity = null;
      if (fakeUser.role === 'hotel' && fakeUser.entityId) {
        entity = await storage.getHotel(fakeUser.entityId);
      } else if (fakeUser.role === 'merchant' && fakeUser.entityId) {
        entity = await storage.getMerchant(fakeUser.entityId);
      }
      
      console.log(`[TEST MODE] Login successful for user: ${username} with role: ${fakeUser.role}`);
      res.json({ user: fakeUser, token, entity });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    try {
      // With JWT, logout is handled client-side by removing the token
      res.json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ message: "Logout failed" });
    }
  });

  // Hotel-Merchant Associations
  app.get("/api/hotels/:hotelId/merchants", async (req, res) => {
    try {
      const hotelId = parseInt(req.params.hotelId);
      const associations = await storage.getHotelMerchants(hotelId);
      
      // Get merchant details for each association
      const merchantsWithDetails = await Promise.all(
        associations.map(async (assoc) => {
          const merchant = await storage.getMerchant(assoc.merchantId);
          return {
            ...assoc,
            merchant,
          };
        })
      );
      
      res.json(merchantsWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hotel merchants" });
    }
  });

  app.get("/api/merchants/:merchantId/hotels", async (req, res) => {
    try {
      const merchantId = parseInt(req.params.merchantId);
      const associations = await storage.getMerchantHotels(merchantId);
      
      // Get hotel details for each association
      const hotelsWithDetails = await Promise.all(
        associations.map(async (assoc) => {
          const hotel = await storage.getHotel(assoc.hotelId);
          return {
            ...assoc,
            hotel,
          };
        })
      );
      
      res.json(hotelsWithDetails);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch merchant hotels" });
    }
  });

  app.post("/api/hotel-merchants", async (req, res) => {
    try {
      const { hotelId, merchantId } = req.body;
      
      if (!hotelId || !merchantId) {
        return res.status(400).json({ message: "hotelId and merchantId required" });
      }
      
      const association = await storage.addHotelMerchant({
        hotelId: parseInt(hotelId),
        merchantId: parseInt(merchantId),
        isActive: true,
      });
      
      res.status(201).json(association);
    } catch (error) {
      res.status(500).json({ message: "Failed to create association" });
    }
  });

  app.put("/api/hotel-merchants/:hotelId/:merchantId", async (req, res) => {
    try {
      const hotelId = parseInt(req.params.hotelId);
      const merchantId = parseInt(req.params.merchantId);
      const { isActive } = req.body;
      
      const association = await storage.updateHotelMerchant(hotelId, merchantId, isActive);
      if (!association) {
        return res.status(404).json({ message: "Association not found" });
      }
      
      res.json(association);
    } catch (error) {
      res.status(500).json({ message: "Failed to update association" });
    }
  });

  app.delete("/api/hotel-merchants/:hotelId/:merchantId", async (req, res) => {
    try {
      const hotelId = parseInt(req.params.hotelId);
      const merchantId = parseInt(req.params.merchantId);
      
      const deleted = await storage.removeHotelMerchant(hotelId, merchantId);
      if (!deleted) {
        return res.status(404).json({ message: "Association not found" });
      }
      
      res.json({ message: "Association removed successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove association" });
    }
  });

  // Add test endpoint for notifications and order simulation
  app.post("/api/test/notification", async (req, res) => {
    try {
      console.log('[TEST] Sending test notification');
      notificationService.sendTestNotification();
      res.json({ message: "Test notification sent" });
    } catch (error) {
      res.status(500).json({ message: "Failed to send test notification" });
    }
  });

  app.post("/api/test/order", async (req, res) => {
    try {
      console.log('[TEST] Creating test order');
      
      // Create a test order with mock data
      const testOrderData = {
        hotelId: 1,
        merchantId: 1,
        clientId: 1,
        customerName: "Test Client",
        customerRoom: "101",
        items: [
          { productId: 1, quantity: 2, name: "Test Product", price: 15.50 }
        ],
        totalAmount: "31.00",
        deliveryNotes: "Test order for notifications"
      };

      const orderNumber = `TEST-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      const merchantCommission = (31.00 * 0.75).toFixed(2);
      const zishopCommission = (31.00 * 0.20).toFixed(2);
      const hotelCommission = (31.00 * 0.05).toFixed(2);

      const enhancedOrderData = {
        ...testOrderData,
        orderNumber,
        merchantCommission,
        zishopCommission,
        hotelCommission,
        status: "pending",
      };

      const order = await storage.createOrder(enhancedOrderData);
      
      // Send notification about new order
      notificationService.notifyNewOrder(order);
      
      res.status(201).json({ 
        message: "Test order created and notification sent", 
        order: order
      });
    } catch (error) {
      console.error("Test order creation error:", error);
      res.status(500).json({ message: "Failed to create test order" });
    }
  });

  app.put("/api/test/order/:id/status", async (req, res) => {
    try {
      const orderId = parseInt(req.params.id);
      const { status } = req.body;
      
      console.log(`[TEST] Updating order ${orderId} status to ${status}`);
      
      const updates: any = { status };
      
      // Add timestamps based on status
      if (status === "confirmed") {
        updates.confirmedAt = new Date().toISOString();
      } else if (status === "delivered") {
        updates.deliveredAt = new Date().toISOString();
      }
      
      const order = await storage.updateOrder(orderId, updates);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      
      // Send notification about status change
      const statusMessages: Record<string, string> = {
        "confirmed": "Votre commande a été confirmée par le commerçant",
        "preparing": "Votre commande est en cours de préparation",
        "ready": "Votre commande est prête",
        "delivering": "Votre commande est en cours de livraison",
        "delivered": "Votre commande a été livrée à la réception",
        "cancelled": "Votre commande a été annulée"
      };
      
      notificationService.notifyOrderUpdate({
        type: 'order_update',
        orderId: order.id,
        orderNumber: order.orderNumber,
        status: status,
        hotelId: order.hotelId,
        merchantId: order.merchantId,
        clientId: order.clientId || undefined,
        message: statusMessages[status] || `Statut de commande mis à jour: ${status}`
      });
      
      res.json({ 
        message: "Test order status updated and notification sent", 
        order: order
      });
    } catch (error) {
      console.error("Test order status update error:", error);
      res.status(500).json({ message: "Failed to update test order status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
