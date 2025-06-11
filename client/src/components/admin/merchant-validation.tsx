import React, { useState } from 'react';
import { Merchant, AdminMerchantValidation } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, MapPin } from 'lucide-react';

interface MerchantValidationProps {
  merchant: Merchant;
  onValidate: (validation: AdminMerchantValidation) => void;
}

export function MerchantValidation({ merchant, onValidate }: MerchantValidationProps) {
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = () => {
    onValidate({
      merchantId: merchant.id,
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
      merchantId: merchant.id,
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
          <CardTitle>Validation du commerçant</CardTitle>
          <Badge variant={merchant.status === 'pending' ? 'outline' : merchant.status === 'approved' ? 'default' : 'destructive'}>
            {merchant.status === 'pending' ? 'En attente' : merchant.status === 'approved' ? 'Approuvé' : 'Rejeté'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Détails du commerçant</h3>
            <p><span className="font-medium">Nom:</span> {merchant.name}</p>
            <p><span className="font-medium">Description:</span> {merchant.description}</p>
            <div className="flex items-center mt-2">
              <MapPin className="h-4 w-4 mr-1 text-gray-500" />
              <p className="text-gray-600">{merchant.address}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Produits ({merchant.products.length})</h4>
            <div className="grid grid-cols-2 gap-4">
              {merchant.products.map((product) => (
                <div key={product.id} className="border rounded-lg p-3">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.price}€</p>
                </div>
              ))}
            </div>
          </div>

          {merchant.status === 'pending' && (
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

          {merchant.status === 'rejected' && merchant.rejectionReason && (
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-700 mb-2">Raison du rejet:</h4>
              <p className="text-red-600">{merchant.rejectionReason}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 