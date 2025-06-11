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
      const hotelData = insertHotelSchema.parse(req.body);
      const hotel = await storage.createHotel(hotelData);
      res.status(201).json(hotel);
    } catch (error) {
      res.status(400).json({ message: "Invalid hotel data" });
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
      const merchantData = insertMerchantSchema.parse(req.body);
      const merchant = await storage.createMerchant(merchantData);
      res.status(201).json(merchant);
    } catch (error) {
      res.status(400).json({ message: "Invalid merchant data" });
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
      
      // TODO: Envoyer une notification au commerçant pour la nouvelle commande
      // TODO: Créer une entrée dans le système de notifications temps réel
      
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

  const httpServer = createServer(app);
  return httpServer;
}
