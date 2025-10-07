'use client';

import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/header';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Smartphone,
  IndianRupee,
  Shield,
  Truck,
  Zap,
  ArrowRight,
  CheckCircle,
  Clock,
  Star,
  Users,
  Phone,
  MapPin
} from 'lucide-react';

const processSteps = [
  {
    icon: Smartphone,
    title: 'Tell Us About Your Phone',
    description: 'Select your phone brand and basic details'
  },
  {
    icon: Phone,
    title: 'Get Connected',
    description: 'Retailers will call you within 24 hours'
  },
  {
    icon: IndianRupee,
    title: 'Get Best Price',
    description: 'Negotiate and get the best deal'
  },
  {
    icon: CheckCircle,
    title: 'Sell & Get Paid',
    description: 'Complete the sale and receive payment'
  }
];

const trustFeatures = [
  {
    icon: IndianRupee,
    title: 'Maximum Value',
    description: 'Get the best prices for your phone',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  {
    icon: Shield,
    title: 'Safe & Secure',
    description: 'Verified retailers and secure transactions',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    icon: Truck,
    title: 'Free Pickup',
    description: 'We come to you, no hassle required',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  },
  {
    icon: Zap,
    title: 'Instant Payment',
    description: 'Get paid immediately after verification',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200'
  }
];

export default function SellPage() {
  // Cache busting to prevent old UI from showing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Add timestamp to prevent caching
      const currentUrl = new URL(window.location.href);
      const timestamp = Date.now();
      
      // If no timestamp in URL, add one to force fresh load
      if (!currentUrl.searchParams.has('t')) {
        currentUrl.searchParams.set('t', timestamp.toString());
        window.history.replaceState({}, '', currentUrl.toString());
      }
      
      // Force reload if this is a cached version
      const lastModified = document.lastModified;
      const currentTime = new Date().getTime();
      const pageAge = currentTime - new Date(lastModified).getTime();
      
      // If page is older than 2 minutes, force reload
      if (pageAge > 2 * 60 * 1000) {
        window.location.reload();
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Hero Image Background */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Sell your phone"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-indigo-900/80" />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Sell Your Old Phone
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Get instant cash for your old phone • Safe & Hassle-free • Free pickup • Best prices guaranteed
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/sell/form">
                <Button size="lg" className="h-14 px-8 text-lg font-semibold bg-white text-blue-600 hover:bg-blue-50">
                  <IndianRupee className="w-6 h-6 mr-2" />
                  Get Best Price Now
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold border-white text-white hover:bg-white hover:text-blue-600">
                <Phone className="w-6 h-6 mr-2" />
                Call Us: +91 98765 43210
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Process Section */}
      <div className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Selling your phone has never been easier. Follow these simple steps to get the best price.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="h-full text-center p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                      <step.icon className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </CardContent>
                </Card>
                
                {/* Arrow between steps */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="w-8 h-8 text-blue-400" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make selling your phone simple, safe, and profitable.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustFeatures.map((feature, index) => (
              <Card key={index} className={`${feature.bgColor} ${feature.borderColor} border-2 hover:shadow-lg transition-shadow`}>
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Sell Your Phone?</h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of satisfied customers who got the best price for their phones.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sell/form">
              <Button size="lg" className="h-14 px-8 text-lg font-semibold bg-white text-blue-600 hover:bg-blue-50">
                <IndianRupee className="w-6 h-6 mr-2" />
                Start Selling Now
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold border-white text-white hover:bg-white hover:text-blue-600">
              <Phone className="w-6 h-6 mr-2" />
              Get Free Quote
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

