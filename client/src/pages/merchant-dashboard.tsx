import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import OrderCard from "@/components/order-card";
import AdvancedOrderManagement from "@/components/advanced-order-management";
import MerchantSidebar from "@/components/merchant-sidebar";
import MerchantHotelsDisplay from "@/components/merchant-hotels-display";
import MerchantProductManagement from "@/components/merchant-product-management";
import { Star, ShoppingCart, Box, Building, Plus, Edit, Trash2, Gift, TrendingUp, Euro, Clock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "@/lib/api";

const productSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  description: z.string().optional(),
  price: z.string().min(1, "Le prix est requis"),
  category: z.string().min(1, "La catégorie est requise"),
  imageUrl: z.string().url("URL d'image invalide").optional().or(z.literal("")),
});

export default function MerchantDashboard() {
  const [selectedMerchantId] = useState(() => {
    // Récupérer l'ID du commerçant depuis localStorage
    const merchantStr = localStorage.getItem("merchant");
    if (merchantStr) {
      const merchant = JSON.parse(merchantStr);
      return merchant.id;
    }
    return 1; // Default to first merchant
  });
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      imageUrl: "",
    },
  });

  // Get merchant data
  const { data: merchant } = useQuery({
    queryKey: ["/api/merchants", selectedMerchantId],
    queryFn: () => fetch(`/api/merchants/${selectedMerchantId}`).then(res => res.json()),
  });

  // Get merchant products
  const { data: products = [] } = useQuery({
    queryKey: ["/api/products/merchant", selectedMerchantId],
    queryFn: () => api.getProductsByMerchant(selectedMerchantId),
  });

  // Get merchant orders
  const { data: orders = [] } = useQuery({
    queryKey: ["/api/orders/merchant", selectedMerchantId],
    queryFn: () => api.getOrdersByMerchant(selectedMerchantId),
  });

  // Get merchant statistics
  const { data: stats } = useQuery({
    queryKey: ["/api/stats/merchant", selectedMerchantId],
    queryFn: () => api.getMerchantStats(selectedMerchantId),
  });

  const createProductMutation = useMutation({
    mutationFn: api.createProduct,
    onSuccess: () => {
      toast({
        title: "Produit créé",
        description: "Le produit a été ajouté avec succès.",
      });
      setIsAddingProduct(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/products/merchant", selectedMerchantId] });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de créer le produit.",
        variant: "destructive",
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.updateProduct(id, data),
    onSuccess: () => {
      toast({
        title: "Produit modifié",
        description: "Le produit a été modifié avec succès.",
      });
      setEditingProduct(null);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/products/merchant", selectedMerchantId] });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de modifier le produit.",
        variant: "destructive",
      });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: api.deleteProduct,
    onSuccess: () => {
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products/merchant", selectedMerchantId] });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le produit.",
        variant: "destructive",
      });
    },
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: number; status: string }) => 
      api.updateOrderStatus(orderId, status),
    onSuccess: () => {
      toast({
        title: "Statut mis à jour",
        description: "Le statut de la commande a été modifié.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/orders/merchant", selectedMerchantId] });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut.",
        variant: "destructive",
      });
    },
  });

  const handleUpdateOrderStatus = (orderId: number, status: string) => {
    updateOrderMutation.mutate({ orderId, status });
  };

  const onSubmitProduct = (values: z.infer<typeof productSchema>) => {
    const productData = {
      ...values,
      merchantId: selectedMerchantId,
      isAvailable: true,
    };

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data: productData });
    } else {
      createProductMutation.mutate(productData);
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    form.reset({
      name: product.name,
      description: product.description || "",
      price: product.price,
      category: product.category,
      imageUrl: product.imageUrl || "",
    });
  };

  const handleDeleteProduct = (productId: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      deleteProductMutation.mutate(productId);
    }
  };

  const recentOrders = orders.slice(0, 5);

  if (!merchant) {
    return <div>Chargement...</div>;
  }

  const renderDashboardContent = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Merchant Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {merchant.imageUrl && (
                      <img
                        src={merchant.imageUrl}
                        alt={merchant.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">{merchant.name}</h2>
                      <p className="text-gray-600">{merchant.address}</p>
                      <p className="text-sm text-gray-500">Boutique de souvenirs • {merchant.category}</p>
                      <div className="flex items-center mt-1">
                        <div className="flex text-yellow-400 text-sm">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 ml-2">
                          ({merchant.rating}) • {merchant.reviewCount} avis
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="bg-accent text-white p-4 rounded-lg">
                      <div className="text-2xl font-bold">€{stats?.dailyRevenue || "0.00"}</div>
                      <div className="text-sm text-gray-600">Revenus aujourd'hui (75%)</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats Cards avec logique de commission */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <ShoppingCart className="text-green-600" size={24} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Commandes aujourd'hui</p>
                      <p className="text-2xl font-bold text-gray-800">{stats?.todayOrders || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Gift className="text-blue-600" size={24} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Souvenirs actifs</p>
                      <p className="text-2xl font-bold text-gray-800">{stats?.activeProducts || 0}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Euro className="text-purple-600" size={24} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Commission (75%)</p>
                      <p className="text-2xl font-bold text-gray-800">€{(parseFloat(stats?.dailyRevenue || "0") * 0.75).toFixed(2)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Clock className="text-orange-600" size={24} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Commandes en attente</p>
                      <p className="text-2xl font-bold text-gray-800">
                        {orders.filter(order => order.status === "pending").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Commandes récentes avec workflow */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-6">Commandes récentes</h3>
                <AdvancedOrderManagement 
                  orders={orders.slice(0, 5)} 
                  userRole="merchant" 
                  entityId={selectedMerchantId}
                />
              </CardContent>
            </Card>
          </div>
        );

      case "products":
        return (
          <MerchantProductManagement merchantId={selectedMerchantId}>
            {products.map(product => (
              <div key={product.id} className="flex items-center justify-between p-4 border-b last:border-b-0">
                <div className="flex items-center space-x-4">
                  {product.imageUrl && (
                    <img src={product.imageUrl} alt={product.name} className="w-12 h-12 object-cover rounded-md" />
                  )}
                  <div>
                    <h4 className="text-lg font-bold text-gray-800">{product.name}</h4>
                    <p className="text-sm text-gray-600">{product.description}</p>
                    <p className="text-sm text-gray-500">Prix: €{product.price}</p>
                    <p className="text-sm text-gray-500">Catégorie: {product.category}</p>
                    {typeof product.stock === 'number' && (
                      <div style={{ fontSize: '0.9em', color: product.stock === 0 ? 'red' : '#555' }}>
                        Stock restant : {product.stock}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </MerchantProductManagement>
        );

      case "orders":
        return (
          <div className="space-y-6">
            {/* Statistiques rapides des commandes */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">En attente</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {orders.filter(o => o.status === "pending").length}
                      </p>
                    </div>
                    <Clock className="text-yellow-600" size={24} />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">En préparation</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {orders.filter(o => o.status === "preparing").length}
                      </p>
                    </div>
                    <Box className="text-orange-600" size={24} />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Prêtes</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {orders.filter(o => o.status === "ready").length}
                      </p>
                    </div>
                    <Gift className="text-blue-600" size={24} />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Livrées</p>
                      <p className="text-2xl font-bold text-green-600">
                        {orders.filter(o => o.status === "delivered").length}
                      </p>
                    </div>
                    <TrendingUp className="text-green-600" size={24} />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Workflow des commandes */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">Workflow des commandes</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Commission: 75% du total</span>
                  </div>
                </div>
                <AdvancedOrderManagement 
                  orders={orders} 
                  userRole="merchant" 
                  entityId={selectedMerchantId}
                />
              </CardContent>
            </Card>
          </div>
        );

      case "hotels":
        return (
          <MerchantHotelsDisplay merchantId={selectedMerchantId} />
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
      <MerchantSidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <div className="flex-1 p-8 bg-gray-50">
        {renderDashboardContent()}
      </div>
    </div>
  );
}
