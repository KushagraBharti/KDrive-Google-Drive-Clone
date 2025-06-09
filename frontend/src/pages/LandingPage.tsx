"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Cloud, Shield, Zap, Users, ArrowRight, Star, Folder, Upload, Share } from "lucide-react"

export default function LandingPage() {
  const [isHovered, setIsHovered] = useState(false)

  const features = [
    {
      icon: <Cloud className="w-8 h-8 text-blue-400" />,
      title: "Cloud Storage",
      description: "Store your files securely in the cloud with unlimited access from anywhere.",
    },
    {
      icon: <Shield className="w-8 h-8 text-emerald-400" />,
      title: "Secure & Private",
      description: "Enterprise-grade security with end-to-end encryption for your peace of mind.",
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: "Lightning Fast",
      description: "Upload, download, and sync your files at blazing speeds with our optimized infrastructure.",
    },
    {
      icon: <Users className="w-8 h-8 text-purple-400" />,
      title: "Team Collaboration",
      description: "Share folders and collaborate with your team in real-time with advanced permissions.",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Manager",
      content:
        "KDrive has revolutionized how our team collaborates. The interface is intuitive and the performance is outstanding.",
      rating: 5,
    },
    {
      name: "Marcus Rodriguez",
      role: "Creative Director",
      content: "Finally, a cloud storage solution that doesn't compromise on design. Beautiful and functional.",
      rating: 5,
    },
    {
      name: "Emily Watson",
      role: "Startup Founder",
      content: "The security features give me confidence to store sensitive business documents. Highly recommended!",
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">KDrive</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className="text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200"
            >
              Features
            </Button>
            <Button
              variant="ghost"
              className="text-slate-300 hover:text-white hover:bg-slate-700 transition-all duration-200"
            >
              Pricing
            </Button>
            <Button
              variant="outline"
              className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white transition-all duration-200"
            >
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Your files,{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-emerald-400 bg-clip-text text-transparent">
                everywhere
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Store, sync, and share your files with the most elegant cloud storage solution. Experience seamless
              collaboration with enterprise-grade security.
            </p>
          </div>

          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              Get Started Free
              <ArrowRight
                className={`w-5 h-5 ml-2 transition-transform duration-200 ${isHovered ? "translate-x-1" : ""}`}
              />
            </Button>
            <p className="text-slate-400 mt-4">No credit card required • 15GB free storage</p>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-400">
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-gradient-to-r from-slate-800/60 to-slate-700/60 backdrop-blur-sm rounded-2xl border border-slate-600/50 p-8 shadow-2xl">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center space-x-2 bg-slate-700/50 rounded-lg p-3">
                    <Folder className="w-6 h-6 text-blue-400" />
                    <span className="text-slate-200 font-medium">Documents</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-slate-700/50 rounded-lg p-3">
                    <Upload className="w-6 h-6 text-emerald-400" />
                    <span className="text-slate-200 font-medium">Upload</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-slate-700/50 rounded-lg p-3">
                    <Share className="w-6 h-6 text-purple-400" />
                    <span className="text-slate-200 font-medium">Share</span>
                  </div>
                </div>
                <div className="h-32 bg-gradient-to-r from-slate-600/30 to-slate-500/30 rounded-lg flex items-center justify-center">
                  <p className="text-slate-300 text-lg">Beautiful, intuitive interface</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why choose KDrive?</h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Built for modern teams who demand both beauty and functionality in their tools.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="bg-slate-800/60 border-slate-700/50 hover:bg-slate-700/60 hover:border-slate-600 transition-all duration-300 transform hover:scale-105 animate-in fade-in slide-in-from-bottom-4 duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Loved by thousands</h2>
            <p className="text-xl text-slate-300">See what our users have to say about KDrive.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="bg-slate-800/60 border-slate-700/50 hover:bg-slate-700/60 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4 duration-700"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-300 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-slate-400 text-sm">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-gradient-to-r from-blue-900/20 to-purple-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Join thousands of users who trust KDrive with their most important files.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
            >
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-slate-700/50 border-slate-600 text-slate-300 hover:bg-slate-600 hover:text-white px-8 py-4 text-lg font-semibold transition-all duration-300"
            >
              View Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900/80 border-t border-slate-700/50 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Cloud className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">KDrive</span>
            </div>
            <div className="flex items-center space-x-6 text-slate-400">
              <a href="#" className="hover:text-white transition-colors duration-200">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition-colors duration-200">
                Terms
              </a>
              <a href="#" className="hover:text-white transition-colors duration-200">
                Support
              </a>
              <span>© 2024 KDrive. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )

export default function LandingPage() {}
