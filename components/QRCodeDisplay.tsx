'use client';

import { useEffect, useState } from 'react';

interface QRData {
  url: string;
  qrCode: string;
  localIP: string;
  port: string;
}

export default function QRCodeDisplay() {
  const [qrData, setQrData] = useState<QRData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    fetchQRCode();
  }, []);

  const fetchQRCode = async () => {
    try {
      const response = await fetch('/api/qr');
      const data = await response.json();
      setQrData(data);
    } catch (error) {
      console.error('Failed to fetch QR code:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !qrData) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {showQR ? (
        <div className="bg-white rounded-lg shadow-2xl p-4 border-2 border-blue-500">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-gray-800">Scan to Test on Phone</h3>
            <button
              onClick={() => setShowQR(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <img src={qrData.qrCode} alt="QR Code" className="w-48 h-48" />
          <p className="text-xs text-center text-gray-600 mt-2 break-all">
            {qrData.url}
          </p>
          <p className="text-xs text-center text-gray-500 mt-1">
            Make sure your phone is on the same WiFi network
          </p>
        </div>
      ) : (
        <button
          onClick={() => setShowQR(true)}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
          title="Show QR Code"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
        </button>
      )}
    </div>
  );
}
