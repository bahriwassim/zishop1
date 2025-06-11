import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrCode, Camera } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface QRScannerProps {
  onScan: (hotelCode: string) => void;
}

export default function QRScanner({ onScan }: QRScannerProps) {
  const [manualCode, setManualCode] = useState("");
  const [showManualInput, setShowManualInput] = useState(false);

  const handleScanSimulation = () => {
    // Simulate QR scan with default hotel code
    onScan("ZI75015");
  };

  const handleManualSubmit = () => {
    if (manualCode.trim()) {
      onScan(manualCode.trim());
    }
  };

  return (
    <div className="p-6 bg-gray-50 border-b">
      <div className="text-center">
        {!showManualInput ? (
          <>
            <div className="bg-white p-4 rounded-xl shadow-sm inline-block mb-4">
              <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                <QrCode className="text-3xl text-gray-400" size={48} />
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-3">Scanner le QR code de votre hôtel</p>
            <Button
              onClick={handleScanSimulation}
              className="mb-2 bg-primary text-white hover:bg-primary/90"
            >
              <Camera className="mr-2" size={16} />
              Simuler scan QR
            </Button>
            <br />
            <Button
              variant="link"
              onClick={() => setShowManualInput(true)}
              className="text-primary text-sm font-medium"
            >
              Saisir le code manuellement
            </Button>
          </>
        ) : (
          <Card className="max-w-sm mx-auto">
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Code hôtel</h3>
              <div className="space-y-3">
                <Input
                  placeholder="Ex: ZI75015"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleManualSubmit()}
                />
                <div className="flex space-x-2">
                  <Button onClick={handleManualSubmit} className="flex-1">
                    Valider
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowManualInput(false)}
                    className="flex-1"
                  >
                    Retour
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
