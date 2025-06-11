import React, { useState } from 'react';
import { Product, AdminProductValidation } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

interface ProductValidationProps {
  product: Product;
  onValidate: (validation: AdminProductValidation) => void;
}

export function ProductValidation({ product, onValidate }: ProductValidationProps) {
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = () => {
    onValidate({
      productId: product.id,
      status: 'approved',
      validatedAt: new Date(),
      validatedBy: 'admin', // À remplacer par l'ID de l'admin connecté
    });
  };

  const handleReject = () => {
    if (!rejectionReason) {
      alert('Veuillez fournir une raison de rejet');
      return;
    }
    onValidate({
      productId: product.id,
      status: 'rejected',
      rejectionReason,
      validatedAt: new Date(),
      validatedBy: 'admin', // À remplacer par l'ID de l'admin connecté
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Validation du produit</CardTitle>
          <Badge variant={product.status === 'pending' ? 'outline' : product.status === 'approved' ? 'success' : 'destructive'}>
            {product.status === 'pending' ? 'En attente' : product.status === 'approved' ? 'Approuvé' : 'Rejeté'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Détails du produit</h3>
              <p><span className="font-medium">Nom:</span> {product.name}</p>
              <p><span className="font-medium">Prix:</span> {product.price}€</p>
              <p><span className="font-medium">Description:</span> {product.description}</p>
            </div>
            <div>
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          </div>

          {product.status === 'pending' && (
            <div className="space-y-4">
              <Textarea
                placeholder="Raison du rejet (obligatoire si rejet)"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="min-h-[100px]"
              />
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={handleReject}
                  className="text-red-600 hover:text-red-700"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Rejeter
                </Button>
                <Button
                  onClick={handleApprove}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approuver
                </Button>
              </div>
            </div>
          )}

          {product.status === 'rejected' && product.rejectionReason && (
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-700 mb-2">Raison du rejet:</h4>
              <p className="text-red-600">{product.rejectionReason}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 