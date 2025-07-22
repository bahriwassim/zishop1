import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertHotelSchema, insertMerchantSchema, insertProductSchema, insertOrderSchema, insertClientSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Hotels
  app.get("/api/hotels", async (req, res) => {
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

  app.post("/api/hotels", async (req, res) => {
    try {
      console.log("Received hotel data:", req.body);
      
      // Générer le QR code automatiquement
      const generateQRCode = (hotelCode: string): string => {
        return `https://zishop.co/hotel/${hotelCode}`;
      };

      const hotelDataWithQR = {
        ...req.body,
        qrCode: generateQRCode(req.body.code),
      };

      console.log("Hotel data with QR:", hotelDataWithQR);
      
      const hotelData = insertHotelSchema.parse(hotelDataWithQR);
      const hotel = await storage.createHotel(hotelData);
      res.status(201).json(hotel);
    } catch (error: any) {
      console.error("Error creating hotel:", error);
      res.status(400).json({ 
        message: "Invalid hotel data", 
        error: error.message || error,
        receivedData: req.body 
      });
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

  app.post("/api/merchants", async (req, res) => {
    try {
      console.log("Received merchant data:", req.body);
      const merchantData = insertMerchantSchema.parse(req.body);
      const merchant = await storage.createMerchant(merchantData);
      res.status(201).json(merchant);
    } catch (error: any) {
      console.error("Error creating merchant:", error);
      res.status(400).json({ 
        message: "Invalid merchant data", 
        error: error.message || error,
        receivedData: req.body 
      });
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

  app.post("/api/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  app.put("/api/products/:id", async (req, res) => {
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

  app.delete("/api/products/:id", async (req, res) => {
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
  app.post("/api/products/:id/validate", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { action, note } = req.body;
      
      console.log(`Validation produit ${id}: ${action}`, { note });
      
      if (!["approve", "reject"].includes(action)) {
        return res.status(400).json({ message: "Action must be 'approve' or 'reject'" });
      }
      
      // Pour l'instant, nous simulons la validation
      // Dans une vraie app, cela mettrait à jour un champ 'validationStatus' 
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Log de validation pour audit
      console.log(`Produit ${product.name} ${action === 'approve' ? 'approuvé' : 'rejeté'} par admin`, {
        productId: id,
        action,
        note,
        timestamp: new Date().toISOString()
      });
      
      // Ici on pourrait envoyer une notification au commerçant
      // et mettre à jour le statut de validation du produit
      
      res.json({ 
        message: `Product ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
        product,
        validation: { action, note, timestamp: new Date().toISOString() }
      });
    } catch (error: any) {
      console.error("Error validating product:", error);
      res.status(500).json({ message: "Failed to validate product" });
    }
  });

  // Orders
  app.get("/api/orders", async (req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/hotel/:hotelId", async (req, res) => {
    try {
      const hotelId = parseInt(req.params.hotelId);
      const orders = await storage.getOrdersByHotel(hotelId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch hotel orders" });
    }
  });

  app.get("/api/orders/merchant/:merchantId", async (req, res) => {
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

  app.post("/api/orders", async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse(req.body);
      // Vérification du stock pour chaque produit commandé
      if (!Array.isArray(orderData.items)) {
        return res.status(400).json({ message: "Le champ 'items' doit être un tableau." });
      }
      for (const item of orderData.items) {
        if (!item || typeof item.productId !== "number" || typeof item.quantity !== "number") {
          return res.status(400).json({ message: "Chaque item doit contenir productId (number) et quantity (number)." });
        }
        const product = await storage.getProduct(item.productId);
        if (!product) {
          return res.status(400).json({ message: `Produit ID ${item.productId} introuvable.` });
        }
        if (typeof product.stock !== "number" || product.stock < item.quantity) {
          return res.status(400).json({ message: `Stock insuffisant pour le produit ${product.name}. Stock actuel: ${product.stock}, demandé: ${item.quantity}` });
        }
      }
      // Décrémenter le stock de chaque produit
      for (const item of orderData.items) {
        const product = await storage.getProduct(item.productId);
        if (product) {
          const currentStock = typeof product.stock === "number" ? product.stock : 0;
          await storage.updateProduct(product.id, { stock: currentStock - item.quantity });
        }
      }
      // Calculer automatiquement les commissions selon le cahier des charges
      const totalAmount = parseFloat(orderData.totalAmount as string);
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
      res.status(201).json(order);
    } catch (error) {
      console.error("Erreur création commande:", error);
      res.status(400).json({ message: "Invalid order data" });
    }
  });

  app.put("/api/orders/:id", async (req, res) => {
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
      
      // TODO: Notifier les parties concernées du changement de statut
      // - Hôtel si statut devient "delivering" ou "delivered"
      // - Client si commande confirmée, prête ou livrée
      // - Admin pour toutes les transitions
      
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
  app.get("/api/users", async (req, res) => {
    try {
      // Récupérer tous les utilisateurs (sans les mots de passe)
      // Cette implémentation dépend de votre storage
      res.json([
        { id: 1, username: "admin", role: "admin", createdAt: new Date().toISOString() },
        { id: 2, username: "hotel_paris", role: "hotel", entityId: 1, createdAt: new Date().toISOString() }
      ]);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post("/api/users", async (req, res) => {
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
      
      // Ici vous créeriez l'utilisateur dans votre base de données
      // Pour cette démo, nous simulons une création réussie
      const newUser = {
        id: Math.floor(Math.random() * 1000),
        username: userData.username,
        role: userData.role,
        entityId: userData.entityId,
        createdAt: new Date().toISOString()
      };
      
      console.log("Utilisateur créé:", newUser);
      res.status(201).json(newUser);
    } catch (error: any) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  // Clients
  app.post("/api/clients/register", async (req, res) => {
    try {
      const clientData = insertClientSchema.parse(req.body);
      
      // Check if email already exists
      const existingClient = await storage.getClientByEmail(clientData.email);
      if (existingClient) {
        return res.status(409).json({ message: "Email already registered" });
      }
      
      const client = await storage.createClient(clientData);
      // Don't return password in response
      const { password, ...clientResponse } = client;
      res.status(201).json(clientResponse);
    } catch (error) {
      res.status(400).json({ message: "Invalid client data" });
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
      
      // Don't return password in response
      const { password: _, ...clientResponse } = client;
      res.json(clientResponse);
    } catch (error) {
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
  app.get("/api/stats/hotel/:hotelId", async (req, res) => {
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

  app.get("/api/stats/merchant/:merchantId", async (req, res) => {
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

  app.get("/api/stats/admin", async (req, res) => {
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

  // User Authentication
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      
      const user = await storage.authenticateUser(username, password);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Get entity details based on role
      let entityDetails = null;
      if (user.role === "hotel" && user.entityId) {
        entityDetails = await storage.getHotel(user.entityId);
      } else if (user.role === "merchant" && user.entityId) {
        entityDetails = await storage.getMerchant(user.entityId);
      }
      
      res.json({
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          entityId: user.entityId,
        },
        entity: entityDetails,
      });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  app.post("/api/auth/logout", async (req, res) => {
    // In a real app, you would invalidate the session/token here
    res.json({ message: "Logged out successfully" });
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

  const httpServer = createServer(app);
  return httpServer;
}
