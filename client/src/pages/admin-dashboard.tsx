import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AdminSidebar from "@/components/admin-sidebar";
import AdvancedOrderManagement from "@/components/advanced-order-management";
import { Building, Store, ShoppingCart, Users, Clock, Plus, Edit, Gift, TrendingUp, Globe, Euro, AlertTriangle } from "lucide-react";
import { api } from "@/lib/api";
import { Product, Merchant, Hotel } from '@/types';
import { ProductValidation } from '@/components/admin/product-validation';
import { MerchantValidation } from '@/components/admin/merchant-validation';
import { HotelValidation } from '@/components/admin/hotel-validation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { validationService } from '@/services/validation.service';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState({
    products: false,
    merchants: false,
    hotels: false
  });
  
  // Get all data
  const { data: hotelsData = [] } = useQuery({
    queryKey: ["/api/hotels"],
    queryFn: api.getHotels,
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["/api/orders"],
    queryFn: api.getAllOrders,
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/stats/admin"],
    queryFn: api.getAdminStats,
  });

  // Get commission statistics for different periods
  const { data: commissionStatsToday } = useQuery({
    queryKey: ["/api/orders/commissions/stats", "today"],
    queryFn: () => fetch("/api/orders/commissions/stats?period=today").then(res => res.json()),
  });

  const { data: commissionStatsWeek } = useQuery({
    queryKey: ["/api/orders/commissions/stats", "week"],
    queryFn: () => fetch("/api/orders/commissions/stats?period=week").then(res => res.json()),
  });

  const { data: commissionStatsMonth } = useQuery({
    queryKey: ["/api/orders/commissions/stats", "month"],
    queryFn: () => fetch("/api/orders/commissions/stats?period=month").then(res => res.json()),
  });

  // Calculate recent activities
  const recentOrders = orders
    .slice(0, 10)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const recentActivities = recentOrders.map(order => ({
    id: order.id,
    type: "order",
    description: `Nouvelle commande #${order.orderNumber} pour €${order.totalAmount}`,
    time: getRelativeTime(order.createdAt),
  }));

  function getRelativeTime(date: Date | string): string {
    const now = new Date();
    const orderDate = new Date(date);
    const diffInMinutes = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `Il y a ${diffInMinutes} minutes`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
    }
  }

  const formatCurrency = (amount: string | number): string => {
    return parseFloat(amount.toString()).toFixed(2);
  };

  // Calculate financial data
  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
  const zishopCommission = totalRevenue * 0.20;
  const hotelCommission = totalRevenue * 0.05;
  const merchantRevenue = totalRevenue * 0.75;

  const todayOrders = orders.filter(order => {
    const today = new Date();
    const orderDate = new Date(order.createdAt);
    return orderDate.toDateString() === today.toDateString();
  });

  const weekOrders = orders.filter(order => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const orderDate = new Date(order.createdAt);
    return orderDate >= weekAgo;
  });

  const monthOrders = orders.filter(order => {
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const orderDate = new Date(order.createdAt);
    return orderDate >= monthAgo;
  });

  // Filtrer les commandes problématiques
  const problematicOrders = orders.filter(order => 
    order.status === "pending" && new Date().getTime() - new Date(order.createdAt).getTime() > 24 * 60 * 60 * 1000 // Plus de 24h en attente
  );

  // Charger les données en attente de validation
  useEffect(() => {
    loadPendingData();
  }, []);

  const loadPendingData = async () => {
    try {
      setLoading({ products: true, merchants: true, hotels: true });
      
      const [pendingProducts, pendingMerchants, pendingHotels] = await Promise.all([
        validationService.getPendingProducts(),
        validationService.getPendingMerchants(),
        validationService.getPendingHotels()
      ]);

      setProducts(pendingProducts);
      setMerchants(pendingMerchants);
      setHotels(pendingHotels);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading({ products: false, merchants: false, hotels: false });
    }
  };

  const handleProductValidation = async (validation: any) => {
    try {
      await validationService.validateProduct(validation);
      toast.success('Produit validé avec succès');
      // Mettre à jour la liste des produits
      setProducts(products.filter(p => p.id !== validation.productId));
    } catch (error) {
      console.error('Erreur lors de la validation du produit:', error);
      toast.error('Erreur lors de la validation du produit');
    }
  };

  const handleMerchantValidation = async (validation: any) => {
    try {
      await validationService.validateMerchant(validation);
      toast.success('Commerçant validé avec succès');
      // Mettre à jour la liste des commerçants
      setMerchants(merchants.filter(m => m.id !== validation.merchantId));
    } catch (error) {
      console.error('Erreur lors de la validation du commerçant:', error);
      toast.error('Erreur lors de la validation du commerçant');
    }
  };

  const handleHotelValidation = async (validation: any) => {
    try {
      await validationService.validateHotel(validation);
      toast.success('Hôtel validé avec succès');
      // Mettre à jour la liste des hôtels
      setHotels(hotels.filter(h => h.id !== validation.hotelId));
    } catch (error) {
      console.error('Erreur lors de la validation de l\'hôtel:', error);
      toast.error('Erreur lors de la validation de l\'hôtel');
    }
  };

  const renderDashboardContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Admin Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800">Administration Zishop</h2>
                    <p className="text-gray-600">Plateforme de souvenirs pour hôtels - Gestion globale</p>
                  </div>
                  <div className="flex space-x-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">€{formatCurrency(totalRevenue)}</div>
                      <div className="text-sm text-gray-500">Revenus totaux</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">€{formatCurrency(zishopCommission)}</div>
                      <div className="text-sm text-gray-500">Commission Zishop (20%)</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Platform Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building className="text-blue-600" size={24} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Hôtels partenaires</p>
                      <p className="text-2xl font-bold text-gray-800">{stats?.totalHotels || hotelsData.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Store className="text-green-600" size={24} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Boutiques souvenirs</p>
                      <p className="text-2xl font-bold text-gray-800">{stats?.totalMerchants || 47}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Gift className="text-purple-600" size={24} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Commandes aujourd'hui</p>
                      <p className="text-2xl font-bold text-gray-800">{todayOrders.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <AlertTriangle className="text-red-600" size={24} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Commandes problématiques</p>
                      <p className="text-2xl font-bold text-gray-800">{problematicOrders.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Commission Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      €{commissionStatsToday?.stats?.merchantCommission?.toFixed(2) || "0.00"}
                    </div>
                    <div className="text-sm text-gray-600">Commissions commerçants aujourd'hui</div>
                    <div className="text-xs text-gray-500 mt-1">75% des ventes</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      €{commissionStatsToday?.stats?.zishopCommission?.toFixed(2) || "0.00"}
                    </div>
                    <div className="text-sm text-gray-600">Revenus Zishop aujourd'hui</div>
                    <div className="text-xs text-gray-500 mt-1">20% des ventes</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      €{commissionStatsToday?.stats?.hotelCommission?.toFixed(2) || "0.00"}
                    </div>
                    <div className="text-sm text-gray-600">Commissions hôtels aujourd'hui</div>
                    <div className="text-xs text-gray-500 mt-1">5% des ventes</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "orders":
        return (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Supervision globale des commandes</h3>
              <AdvancedOrderManagement 
                orders={orders.slice(0, 20)} 
                userRole="admin"
              />
            </CardContent>
          </Card>
        );

      case "hotels":
        return (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Gestion des Hôtels Partenaires</h3>
                <Button>
                  <Plus className="mr-2" size={16} />
                  Nouvel hôtel
                </Button>
              </div>
              <div className="space-y-4">
                {hotelsData.slice(0, 10).map((hotel) => {
                  const hotelOrders = orders.filter(o => o.hotelId === hotel.id);
                  const hotelRevenue = hotelOrders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0);
                  const hotelCommissionAmount = hotelRevenue * 0.05;
                  
                  return (
                    <div key={hotel.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Building className="text-primary" size={24} />
                        <div>
                          <h4 className="font-medium text-gray-800">{hotel.name}</h4>
                          <p className="text-sm text-gray-600">{hotel.code}</p>
                          <p className="text-xs text-gray-500">
                            {hotelOrders.length} commandes • €{hotelCommissionAmount.toFixed(2)} commission
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Badge className="bg-accent text-white">Actif</Badge>
                        <Button size="sm" variant="outline">
                          <Edit size={14} />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );

      case "merchants":
        return (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Boutiques de Souvenirs</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-gray-800">Souvenirs de Paris</h4>
                    <p className="text-sm text-gray-600">Monuments, magnets, artisanat</p>
                    <div className="flex justify-between items-center mt-2">
                      <Badge className="bg-green-500 text-white text-xs">Actif</Badge>
                      <span className="text-xs text-gray-500">€245 revenus</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-gray-800">Art & Craft Paris</h4>
                    <p className="text-sm text-gray-600">Artisanat local, bijoux</p>
                    <div className="flex justify-between items-center mt-2">
                      <Badge className="bg-green-500 text-white text-xs">Actif</Badge>
                      <span className="text-xs text-gray-500">€189 revenus</span>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium text-gray-800">Galerie Française</h4>
                    <p className="text-sm text-gray-600">Livres d'art, cartes postales</p>
                    <div className="flex justify-between items-center mt-2">
                      <Badge className="bg-green-500 text-white text-xs">Actif</Badge>
                      <span className="text-xs text-gray-500">€156 revenus</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        );

      case "products":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Validation des produits</CardTitle>
            </CardHeader>
            <CardContent>
              {loading.products ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zishop-blue"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {products.map((product) => (
                    <ProductValidation
                      key={product.id}
                      product={product}
                      onValidate={handleProductValidation}
                    />
                  ))}
                  {products.length === 0 && (
                    <p className="text-center text-gray-500">Aucun produit en attente de validation</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );

      case "merchants":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Validation des commerçants</CardTitle>
            </CardHeader>
            <CardContent>
              {loading.merchants ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zishop-blue"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {merchants.map((merchant) => (
                    <MerchantValidation
                      key={merchant.id}
                      merchant={merchant}
                      onValidate={handleMerchantValidation}
                    />
                  ))}
                  {merchants.length === 0 && (
                    <p className="text-center text-gray-500">Aucun commerçant en attente de validation</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );

      case "hotels":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Validation des hôtels</CardTitle>
            </CardHeader>
            <CardContent>
              {loading.hotels ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zishop-blue"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {hotels.map((hotel) => (
                    <HotelValidation
                      key={hotel.id}
                      hotel={hotel}
                      onValidate={handleHotelValidation}
                    />
                  ))}
                  {hotels.length === 0 && (
                    <p className="text-center text-gray-500">Aucun hôtel en attente de validation</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );

      default:
        return (
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-gray-800">Section en développement</h3>
              <p className="text-gray-600 mt-2">Cette fonctionnalité sera disponible prochainement.</p>
            </CardContent>
          </Card>
        );
    }
  };

  return (
    <div className="flex">
      <AdminSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 p-8 bg-gray-50">
        {renderDashboardContent()}

        {/* Enhanced Financial Dashboard - Only show on dashboard */}
        {activeSection === "dashboard" && (
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-6">Tableau financier détaillé - Commissions</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Période</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Commandes</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Chiffre d'affaires</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Commission Zishop (20%)</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Commission Hôtels (5%)</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Reversé Commerçants (75%)</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Ticket moyen</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium text-gray-800">Aujourd'hui</td>
                      <td className="py-3 px-4">{commissionStatsToday?.stats?.orderCount || 0}</td>
                      <td className="py-3 px-4 font-semibold">
                        €{commissionStatsToday?.stats?.totalRevenue?.toFixed(2) || "0.00"}
                      </td>
                      <td className="py-3 px-4 text-primary font-semibold">
                        €{commissionStatsToday?.stats?.zishopCommission?.toFixed(2) || "0.00"}
                      </td>
                      <td className="py-3 px-4 text-secondary font-semibold">
                        €{commissionStatsToday?.stats?.hotelCommission?.toFixed(2) || "0.00"}
                      </td>
                      <td className="py-3 px-4 text-accent font-semibold">
                        €{commissionStatsToday?.stats?.merchantCommission?.toFixed(2) || "0.00"}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        €{commissionStatsToday?.averageOrderValue?.toFixed(2) || "0.00"}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium text-gray-800">Cette semaine</td>
                      <td className="py-3 px-4">{commissionStatsWeek?.stats?.orderCount || 0}</td>
                      <td className="py-3 px-4 font-semibold">
                        €{commissionStatsWeek?.stats?.totalRevenue?.toFixed(2) || "0.00"}
                      </td>
                      <td className="py-3 px-4 text-primary font-semibold">
                        €{commissionStatsWeek?.stats?.zishopCommission?.toFixed(2) || "0.00"}
                      </td>
                      <td className="py-3 px-4 text-secondary font-semibold">
                        €{commissionStatsWeek?.stats?.hotelCommission?.toFixed(2) || "0.00"}
                      </td>
                      <td className="py-3 px-4 text-accent font-semibold">
                        €{commissionStatsWeek?.stats?.merchantCommission?.toFixed(2) || "0.00"}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        €{commissionStatsWeek?.averageOrderValue?.toFixed(2) || "0.00"}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium text-gray-800">Ce mois</td>
                      <td className="py-3 px-4">{commissionStatsMonth?.stats?.orderCount || 0}</td>
                      <td className="py-3 px-4 font-semibold">
                        €{commissionStatsMonth?.stats?.totalRevenue?.toFixed(2) || "0.00"}
                      </td>
                      <td className="py-3 px-4 text-primary font-semibold">
                        €{commissionStatsMonth?.stats?.zishopCommission?.toFixed(2) || "0.00"}
                      </td>
                      <td className="py-3 px-4 text-secondary font-semibold">
                        €{commissionStatsMonth?.stats?.hotelCommission?.toFixed(2) || "0.00"}
                      </td>
                      <td className="py-3 px-4 text-accent font-semibold">
                        €{commissionStatsMonth?.stats?.merchantCommission?.toFixed(2) || "0.00"}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        €{commissionStatsMonth?.averageOrderValue?.toFixed(2) || "0.00"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
