import { useState, useEffect } from 'react';
import { Button } from "@/Components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Smartphone, Tablet, Monitor, Grid3X3, Columns, Type } from 'lucide-react';
import { isMobile, isTablet, isDesktop, getCurrentBreakpoint } from '../utils/responsive';

const ResponsiveTest = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    breakpoint: 'sm',
    isMobile: false,
    isTablet: false,
    isDesktop: false
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      setDeviceInfo({
        width: window.innerWidth,
        height: window.innerHeight,
        breakpoint: getCurrentBreakpoint(),
        isMobile: isMobile(),
        isTablet: isTablet(),
        isDesktop: isDesktop()
      });
    };

    updateDeviceInfo();
    
    // Listen for resize events
    window.addEventListener('resize', updateDeviceInfo);
    return () => window.removeEventListener('resize', updateDeviceInfo);
  }, []);

  const getDeviceIcon = () => {
    if (deviceInfo.isMobile) return <Smartphone className="w-6 h-6" />;
    if (deviceInfo.isTablet) return <Tablet className="w-6 h-6" />;
    if (deviceInfo.isDesktop) return <Monitor className="w-6 h-6" />;
    return null;
  };

  const getDeviceName = () => {
    if (deviceInfo.isMobile) return 'Mobile Device';
    if (deviceInfo.isTablet) return 'Tablet Device';
    if (deviceInfo.isDesktop) return 'Desktop Device';
    return 'Unknown';
  };

  const getBreakpointColor = () => {
    switch (deviceInfo.breakpoint) {
      case 'sm': return 'bg-blue-500';
      case 'md': return 'bg-purple-500';
      case 'lg': return 'bg-green-500';
      case 'xl': return 'bg-orange-500';
      case '2xl': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#4facfe] to-[#00f2fe] p-4 md:p-8">
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 text-center">
          📱 Responsive Design Test Page
        </h1>

        {/* Device Information */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getDeviceIcon()}
              Current Device Information
            </CardTitle>
            <CardDescription>Real-time device and viewport information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Device Type</p>
                <Badge variant="outline" className="text-base py-1">
                  {getDeviceName()}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Screen Dimensions</p>
                <p className="text-lg font-semibold">{deviceInfo.width} × {deviceInfo.height}px</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Breakpoint</p>
                <Badge className={`${getBreakpointColor()} text-white`}>
                  {deviceInfo.breakpoint.toUpperCase()}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Is Mobile?</p>
                <Badge variant={deviceInfo.isMobile ? "default" : "secondary"}>
                  {deviceInfo.isMobile ? "Yes ✓" : "No ✗"}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Is Tablet?</p>
                <Badge variant={deviceInfo.isTablet ? "default" : "secondary"}>
                  {deviceInfo.isTablet ? "Yes ✓" : "No ✗"}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-gray-500">Is Desktop?</p>
                <Badge variant={deviceInfo.isDesktop ? "default" : "secondary"}>
                  {deviceInfo.isDesktop ? "Yes ✓" : "No ✗"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Breakpoint Reference */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle>Responsive Breakpoints</CardTitle>
            <CardDescription>Tailwind CSS breakpoints used in WanderWise</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Breakpoint</th>
                    <th className="text-left p-3">Min Width</th>
                    <th className="text-left p-3">Max Width</th>
                    <th className="text-left p-3">Device Type</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b bg-blue-50">
                    <td className="p-3"><Badge>sm</Badge></td>
                    <td className="p-3">0px</td>
                    <td className="p-3">640px</td>
                    <td className="p-3">📱 Mobile</td>
                  </tr>
                  <tr className="border-b bg-purple-50">
                    <td className="p-3"><Badge>md</Badge></td>
                    <td className="p-3">641px</td>
                    <td className="p-3">1024px</td>
                    <td className="p-3">📟 Tablet</td>
                  </tr>
                  <tr className="border-b bg-green-50">
                    <td className="p-3"><Badge>lg</Badge></td>
                    <td className="p-3">1025px</td>
                    <td className="p-3">1280px</td>
                    <td className="p-3">💻 Laptop</td>
                  </tr>
                  <tr className="border-b bg-orange-50">
                    <td className="p-3"><Badge>xl</Badge></td>
                    <td className="p-3">1281px</td>
                    <td className="p-3">1536px</td>
                    <td className="p-3">🖥️ Desktop</td>
                  </tr>
                  <tr className="bg-red-50">
                    <td className="p-3"><Badge>2xl</Badge></td>
                    <td className="p-3">1537px+</td>
                    <td className="p-3">∞</td>
                    <td className="p-3">🖥️ Large Desktop</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Responsive Grid Demo */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Grid3X3 className="w-5 h-5" />
              Responsive Grid Layout
            </CardTitle>
            <CardDescription>This grid adapts to your screen size</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="bg-gray-100 p-6 rounded-lg text-center">
                  <p className="text-lg font-semibold">Card {item}</p>
                  <p className="text-sm text-gray-500">Responsive</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-gray-600 text-center">
              📱 Mobile: 1 column | 📟 Tablet: 2 columns | 💻 Desktop: 3 columns
            </p>
          </CardContent>
        </Card>

        {/* Typography Scale */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="w-5 h-5" />
              Responsive Typography
            </CardTitle>
            <CardDescription>Text scales beautifully across all devices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">Heading 1</h1>
              <p className="text-sm text-gray-500">Responsive: 4xl → 5xl → 6xl</p>
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">Heading 2</h2>
              <p className="text-sm text-gray-500">Responsive: 3xl → 4xl → 5xl</p>
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold">Heading 3</h3>
              <p className="text-sm text-gray-500">Responsive: 2xl → 3xl → 4xl</p>
            </div>
            <div>
              <p className="text-base md:text-lg lg:text-xl">Body text scales too!</p>
              <p className="text-sm text-gray-500">Base size adjusts per breakpoint</p>
            </div>
          </CardContent>
        </Card>

        {/* Touch Targets */}
        <Card className="mb-6 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Columns className="w-5 h-5" />
              Touch-Friendly Buttons
            </CardTitle>
            <CardDescription>All interactive elements are at least 44x44px</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <Button size="lg" className="w-full md:w-auto min-h-[44px]">
                Full-width on Mobile
              </Button>
              <Button size="lg" variant="secondary" className="w-full md:w-auto min-h-[44px]">
                Auto-width on Desktop
              </Button>
              <Button size="lg" variant="outline" className="w-full md:w-auto min-h-[44px]">
                Touch-Optimized
              </Button>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              ✓ Minimum 44px height for easy tapping
            </p>
          </CardContent>
        </Card>

        {/* Testing Tips */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>🧪 Responsive Testing Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Resize your browser window to see layouts adapt</li>
              <li>Use DevTools device emulation (Ctrl+Shift+M)</li>
              <li>Test on real mobile devices</li>
              <li>Try both portrait and landscape orientations</li>
              <li>Check that all buttons are easily tappable</li>
              <li>Verify text is readable without zooming</li>
              <li>Ensure no horizontal scrolling on mobile</li>
              <li>Test touch interactions on touch devices</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResponsiveTest;
