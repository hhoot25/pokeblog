import { NextResponse } from 'next/server';
import QRCode from 'qrcode';
import { networkInterfaces } from 'os';

function getLocalIP(): string {
  const nets = networkInterfaces();

  for (const name of Object.keys(nets)) {
    const netArray = nets[name];
    if (!netArray) continue;

    for (const net of netArray) {
      // Skip internal (loopback) and non-IPv4 addresses
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }

  return 'localhost';
}

export async function GET() {
  try {
    const localIP = getLocalIP();
    const port = process.env.PORT || 3000;
    const url = `http://${localIP}:${port}`;

    // Generate QR code as data URL
    const qrCodeDataURL = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
    });

    return NextResponse.json({
      url,
      qrCode: qrCodeDataURL,
      localIP,
      port,
    });
  } catch (error) {
    console.error('Error generating QR code:', error);
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    );
  }
}
