import React, { useState } from 'react';
import { Hotel, AdminHotelValidation } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, MapPin, QrCode } from 'lucide-react';

interface HotelValidationProps {
  hotel: Hotel;
  onValidate: (validation: AdminHotelValidation) => void;
}

export function HotelValidation({ hotel, onValidate }: HotelValidationProps) {
  const [rejectionReason, setRejectionReason] = useState('');

  const handleApprove = () => {
    onValidate({
      hotelId: hotel.id,
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
      hotelId: hotel.id,
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
          <CardTitle>Validation de l'hôtel</CardTitle>
          <Badge variant={hotel.status === 'pending' ? 'outline' : hotel.status === 'approved' ? 'default' : 'destructive'}>
            {hotel.status === 'pending' ? 'En attente' : hotel.status === 'approved' ? 'Approuvé' : 'Rejeté'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Détails de l'hôtel</h3>
            <p><span className="font-medium">Nom:</span> {hotel.name}</p>
            <div className="flex items-center mt-2">
              <MapPin className="h-4 w-4 mr-1 text-gray-500" />
              <p className="text-gray-600">{hotel.address}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">QR Code</h4>
            <div className="flex items-center space-x-2">
              <QrCode className="h-6 w-6 text-zishop-blue" />
              <p className="text-sm text-gray-600">{hotel.qrCode}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Commerçants associés ({hotel.merchants.length})</h4>
            <div className="grid grid-cols-2 gap-4">
              {hotel.merchants.map((merchant) => (
                <div key={merchant.id} className="border rounded-lg p-3">
                  <p className="font-medium">{merchant.name}</p>
                  <p className="text-sm text-gray-600">{merchant.products.length} produits</p>
                </div>
              ))}
            </div>
          </div>

          {hotel.status === 'pending' && (
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

          {hotel.status === 'rejected' && hotel.rejectionReason && (
            <div className="bg-red-50 p-4 rounded-lg">
              <h4 className="font-semibold text-red-700 mb-2">Raison du rejet:</h4>
              <p className="text-red-600">{hotel.rejectionReason}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 