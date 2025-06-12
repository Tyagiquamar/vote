"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Github,
  Twitter,
  DiscIcon as Discord,
  Mail,
  Zap,
  Shield,
  Globe,
  Users,
  ArrowRight,
  ExternalLink,
} from "lucide-react"

const footerLinks = {
  platform: [
    { name: "DAO Voting", href: "/dao" },
    { name: "Crowdfunding", href: "/crowdfunding" },
    { name: "Analytics", href: "#" },
    { name: "API Documentation", href: "#" },
  ],
  resources: [
    { name: "Documentation", href: "#" },
    { name: "Tutorials", href: "#" },
    { name: "Community", href: "#" },
    { name: "Blog", href: "#" },
  ],
  company: [
    { name: "About Us", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Press Kit", href: "#" },
    { name: "Contact", href: "#" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
    { name: "Security", href: "#" },
  ],
}

const socialLinks = [
  { name: "GitHub", icon: Github, href: "#", color: "hover:text-gray-400" },
  { name: "Twitter", icon: Twitter, href: "#", color: "hover:text-blue-400" },
  { name: "Discord", icon: Discord, href: "#", color: "hover:text-indigo-400" },
  { name: "Email", icon: Mail, href: "#", color: "hover:text-green-400" },
]

const features = [
  { icon: Shield, text: "Audited Smart Contracts" },
  { icon: Globe, text: "Cross-Chain Compatible" },
  { icon: Users, text: "Community Governed" },
  { icon: Zap, text: "Lightning Fast" },
]

export function Footer() {
  return (
    <footer className="bg-background border-t border-border/50">
      {/* Newsletter Section */}
      <div className="border-b border-border/50">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h3 className="text-3xl font-bold mb-4">Stay Updated</h3>
            <p className="text-muted-foreground text-lg mb-8">
              Get the latest updates on new features, governance proposals, and platform developments
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input type="email" placeholder="Enter your email" className="flex-1" />
              <Button className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                Subscribe
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Link href="/" className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-br from-primary to-primary/80 rounded-xl shadow-lg">
                  <Zap className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Web3 dApp Suite</h2>
                  <p className="text-sm text-muted-foreground">Decentralized Platform</p>
                </div>
              </Link>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Empowering the future of decentralized governance and crowdfunding with secure, transparent, and
                user-friendly Web3 applications.
              </p>

              {/* Features */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.text}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-2 text-sm"
                  >
                    <feature.icon className="h-4 w-4 text-primary" />
                    <span className="text-muted-foreground">{feature.text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                {socialLinks.map((social, index) => (
                  <motion.div
                    key={social.name}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={social.href}
                      className={`p-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground ${social.color} transition-all duration-300`}
                    >
                      <social.icon className="h-5 w-5" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold text-foreground mb-4 capitalize">
                {category === "platform" ? "Platform" : category}
              </h3>
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <motion.li
                    key={link.name}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors duration-300 flex items-center gap-1 group"
                    >
                      {link.name}
                      {link.href.startsWith("http") && (
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      )}
                    </Link>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Bottom Section */}
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-muted-foreground">
            <p>&copy; 2024 Web3 dApp Suite. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                All systems operational
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Built with ❤️ for Web3</span>
            <div className="flex items-center gap-1">
              <span>Powered by</span>
              <Link href="#" className="text-foreground hover:text-primary transition-colors duration-300">
                Next.js
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
