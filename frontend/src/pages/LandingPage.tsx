"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Cloud, Shield, Zap, Users, ArrowRight, Star, Folder, Upload, Share } from "lucide-react"

export default function LandingPage() {
  const [isHovered, setIsHovered] = useState(false)
  const navigate = useNavigate()

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
      description: "Upload, download, and sync your files at blazing speeds with our infrastructure.",
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
      rating: 4,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-card/80 px-6 py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <Cloud className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-foreground">KDrive</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              className="rounded-xl bg-card/60 text-foreground transition-colors duration-200 hover:bg-accent hover:text-accent-foreground"
              onClick={() => navigate('/signin')}
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
            <h1 className="mb-6 text-5xl font-bold tracking-tight text-foreground md:text-7xl">
              Your files,{" "}
              <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-emerald-400 bg-clip-text text-transparent">
                everywhere
              </span>
            </h1>
            <p className="mx-auto mb-8 max-w-3xl text-xl leading-relaxed text-muted-foreground">
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
              onClick={() => navigate('/signin')}
            >
              Get Started Free
              <ArrowRight
                className={`w-5 h-5 ml-2 transition-transform duration-200 ${isHovered ? "translate-x-1" : ""}`}
              />
            </Button>
            <p className="mt-4 text-muted-foreground">No credit card required • 15GB free storage</p>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-400">
            <div className="relative max-w-4xl mx-auto">
              <div className="rounded-2xl border border-border/60 bg-gradient-to-r from-card/70 to-card/60 p-8 shadow-2xl backdrop-blur-sm">
                <div className="grid items-center justify-center grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center space-x-2 rounded-lg bg-muted/60 p-3 transition-all duration-200 hover:bg-muted/80">
                    <Folder className="w-6 h-6 text-blue-400" />
                    <span className="font-medium text-foreground">Documents</span>
                  </div>
                  <div className="flex items-center space-x-2 rounded-lg bg-muted/60 p-3 transition-all duration-200 hover:bg-muted/80">
                    <Upload className="w-6 h-6 text-emerald-400" />
                    <span className="font-medium text-foreground">Upload</span>
                  </div>
                  <div className="flex items-center space-x-2 rounded-lg bg-muted/60 p-3 transition-all duration-200 hover:bg-muted/80">
                    <Share className="w-6 h-6 text-purple-400" />
                    <span className="font-medium text-foreground">Share</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/30 px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-foreground">Why choose KDrive?</h2>
            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              Built for modern teams who demand both beauty and functionality in their tools.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="flex h-64 items-center justify-center border border-border/60 bg-card/70 transition-all duration-300 hover:-translate-y-1 hover:border-border hover:bg-card animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
                  <div className="mb-4 flex w-full items-center justify-center">{feature.icon}</div>
                  <h3 className="mb-2 text-xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="leading-relaxed text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-foreground">Loved by thousands</h2>
            <p className="text-xl text-muted-foreground">See what our users have to say about KDrive.</p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="h-64 border border-border/60 bg-card/70 transition-all duration-300 hover:-translate-y-1 hover:border-border hover:bg-card animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardContent className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
                  <div className="mb-4 flex w-full items-center justify-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="mb-4 italic text-muted-foreground">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary/20 to-accent/20 px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-4xl font-bold text-foreground">Ready to get started?</h2>
          <p className="mb-8 text-xl text-muted-foreground">
            Join thousands of users who trust KDrive with their most important files.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
              onClick={() => navigate('/signin')}
            >
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-xl bg-card/60 text-foreground transition-all duration-300 hover:bg-accent hover:text-accent-foreground px-8 py-4 text-lg font-semibold"
            >
              View Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 bg-card/80 px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center space-x-2 md:mb-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <Cloud className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-foreground">KDrive</span>
            </div>
            <div className="flex items-center space-x-6 text-muted-foreground">
              <a href="#" className="transition-colors duration-200 hover:text-foreground">
                Privacy
              </a>
              <a href="#" className="transition-colors duration-200 hover:text-foreground">
                Terms
              </a>
              <a href="#" className="transition-colors duration-200 hover:text-foreground">
                Support
              </a>
              <span>© 2024 KDrive. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}