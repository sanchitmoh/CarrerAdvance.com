"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import BackButton from "@/components/back-button"
import { Settings, Shield, Mail, CreditCard, Zap, Cog, Save, AlertTriangle } from "lucide-react"

export default function AdminSettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [twoFactorAuth, setTwoFactorAuth] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [autoBackup, setAutoBackup] = useState(true)

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
        <div className="px-0 pt-0">
          <BackButton />
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
              <Settings className="h-6 w-6 sm:h-8 sm:w-8 text-green-600 flex-shrink-0" />
              <span className="break-words">System Settings</span>
            </h1>
            <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
              Configure platform settings and preferences
            </p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto text-sm sm:text-base">
            <Save className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">Save All Changes</span>
          </Button>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="general" className="space-y-4 sm:space-y-6">
          <div className="w-full overflow-x-auto">
            <TabsList className="inline-flex w-max min-w-full sm:grid sm:grid-cols-6 bg-white border">
              <TabsTrigger
                value="general"
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 text-xs sm:text-sm whitespace-nowrap"
              >
                <Cog className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="hidden xs:inline">General</span>
                <span className="xs:hidden">Gen</span>
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 text-xs sm:text-sm whitespace-nowrap"
              >
                <Shield className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="hidden xs:inline">Security</span>
                <span className="xs:hidden">Sec</span>
              </TabsTrigger>
              <TabsTrigger
                value="email"
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 text-xs sm:text-sm whitespace-nowrap"
              >
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="hidden xs:inline">Email</span>
                <span className="xs:hidden">Mail</span>
              </TabsTrigger>
              <TabsTrigger
                value="payment"
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 text-xs sm:text-sm whitespace-nowrap"
              >
                <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="hidden xs:inline">Payment</span>
                <span className="xs:hidden">Pay</span>
              </TabsTrigger>
              <TabsTrigger
                value="features"
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 text-xs sm:text-sm whitespace-nowrap"
              >
                <Zap className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="hidden xs:inline">Features</span>
                <span className="xs:hidden">Feat</span>
              </TabsTrigger>
              <TabsTrigger
                value="advanced"
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 text-xs sm:text-sm whitespace-nowrap"
              >
                <Settings className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="hidden xs:inline">Advanced</span>
                <span className="xs:hidden">Adv</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* General Settings Tab */}
          <TabsContent value="general" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Cog className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                  <span className="break-words">General Settings</span>
                </CardTitle>
                <CardDescription className="text-sm">Basic platform configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="siteName" className="text-sm font-medium">
                      Site Name
                    </Label>
                    <Input id="siteName" defaultValue="CareerAdvance" className="text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="supportEmail" className="text-sm font-medium">
                      Support Email
                    </Label>
                    <Input
                      id="supportEmail"
                      type="email"
                      defaultValue="support@careeradvance.com"
                      className="text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteDescription" className="text-sm font-medium">
                    Site Description
                  </Label>
                  <Textarea
                    id="siteDescription"
                    defaultValue="Advance your career with our comprehensive learning platform and job opportunities."
                    rows={3}
                    className="text-sm resize-none"
                  />
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-orange-900 text-sm sm:text-base break-words">Maintenance Mode</h4>
                      <p className="text-xs sm:text-sm text-orange-700 break-words">
                        Enable maintenance mode to restrict access
                      </p>
                    </div>
                  </div>
                  <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} className="flex-shrink-0" />
                </div>

                <div className="flex justify-end">
                  <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto text-sm">
                    Save General Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings Tab */}
          <TabsContent value="security" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                  <span className="break-words">Security Settings</span>
                </CardTitle>
                <CardDescription className="text-sm">Configure security and authentication settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-blue-900 text-sm sm:text-base break-words">
                        Two-Factor Authentication
                      </h4>
                      <p className="text-xs sm:text-sm text-blue-700 break-words">Require 2FA for all admin accounts</p>
                    </div>
                    <Switch checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} className="flex-shrink-0" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="minPasswordLength" className="text-sm font-medium">
                        Minimum Password Length
                      </Label>
                      <Input id="minPasswordLength" type="number" defaultValue="8" className="text-sm" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout" className="text-sm font-medium">
                        Session Timeout (minutes)
                      </Label>
                      <Input id="sessionTimeout" type="number" defaultValue="60" className="text-sm" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxLoginAttempts" className="text-sm font-medium">
                        Max Login Attempts
                      </Label>
                      <Input id="maxLoginAttempts" type="number" defaultValue="5" className="text-sm" />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto text-sm">
                    Save Security Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Email Settings Tab */}
          <TabsContent value="email" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                  Email Configuration
                </CardTitle>
                <CardDescription className="text-sm">Configure SMTP settings and email notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost" className="text-sm font-medium">
                      SMTP Host
                    </Label>
                    <Input id="smtpHost" defaultValue="smtp.gmail.com" className="text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort" className="text-sm font-medium">
                      SMTP Port
                    </Label>
                    <Input id="smtpPort" type="number" defaultValue="587" className="text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpUsername" className="text-sm font-medium">
                      SMTP Username
                    </Label>
                    <Input id="smtpUsername" defaultValue="admin@careeradvance.com" className="text-sm" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPassword" className="text-sm font-medium">
                      SMTP Password
                    </Label>
                    <Input id="smtpPassword" type="password" defaultValue="••••••••" className="text-sm" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                  <div>
                    <h4 className="font-medium text-green-900 text-sm sm:text-base">Email Notifications</h4>
                    <p className="text-sm text-green-700">Enable system email notifications</p>
                  </div>
                  <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                </div>

                <div className="flex justify-end">
                  <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto text-sm">
                    Save Email Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Settings Tab */}
          <TabsContent value="payment" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                  Payment Configuration
                </CardTitle>
                <CardDescription className="text-sm">Configure payment gateways and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="defaultCurrency" className="text-sm font-medium">
                      Default Currency
                    </Label>
                    <Select defaultValue="usd">
                      <SelectTrigger>
                        <SelectValue placeholder="Select currency" className="text-sm" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">USD - US Dollar</SelectItem>
                        <SelectItem value="eur">EUR - Euro</SelectItem>
                        <SelectItem value="gbp">GBP - British Pound</SelectItem>
                        <SelectItem value="cad">CAD - Canadian Dollar</SelectItem>
                        <SelectItem value="aud">AUD - Australian Dollar</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxRate" className="text-sm font-medium">
                      Tax Rate (%)
                    </Label>
                    <Input id="taxRate" type="number" defaultValue="8.5" step="0.1" className="text-sm" />
                  </div>
                </div>

                <Separator />

                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4 text-sm sm:text-base">Stripe Configuration</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="stripePublicKey" className="text-sm font-medium">
                          Stripe Public Key
                        </Label>
                        <Input id="stripePublicKey" defaultValue="pk_test_..." className="text-sm" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stripeSecretKey" className="text-sm font-medium">
                          Stripe Secret Key
                        </Label>
                        <Input id="stripeSecretKey" type="password" defaultValue="sk_test_..." className="text-sm" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-4 text-sm sm:text-base">PayPal Configuration</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="paypalClientId" className="text-sm font-medium">
                          PayPal Client ID
                        </Label>
                        <Input
                          id="paypalClientId"
                          defaultValue="AYSq3RDGsmBLJE-otTkBtM-jBRd1TCQwFf9RGfwddNXWz0uFU9ztymylOhRS"
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto text-sm">
                    Save Payment Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Features Settings Tab */}
          <TabsContent value="features" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                  <span className="break-words">Feature Flags</span>
                </CardTitle>
                <CardDescription className="text-sm">Enable or disable platform features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="grid gap-4 grid-cols-2 mb-6">
                  <div className="text-center p-3 sm:p-4 border rounded-lg bg-blue-50">
                    <div className="text-xl sm:text-2xl font-bold text-blue-600">5</div>
                    <div className="text-xs sm:text-sm text-muted-foreground break-words">Active Features</div>
                  </div>
                  <div className="text-center p-3 sm:p-4 border rounded-lg bg-green-50">
                    <div className="text-xl sm:text-2xl font-bold text-green-600">2,847</div>
                    <div className="text-xs sm:text-sm text-muted-foreground break-words">Users Affected</div>
                  </div>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 mb-1">
                        <h4 className="font-medium text-blue-900 text-sm sm:text-base break-words">Course Creation</h4>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full w-fit">Active</span>
                      </div>
                      <p className="text-xs sm:text-sm text-blue-700 break-words">
                        Allow teachers to create new courses
                      </p>
                      <p className="text-xs text-blue-600 mt-1 break-words">
                        Used by 234 teachers • 1,456 courses created
                      </p>
                    </div>
                    <Switch defaultChecked className="flex-shrink-0" />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 mb-1">
                        <h4 className="font-medium text-purple-900 text-sm sm:text-base break-words">Job Matching</h4>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full w-fit">Active</span>
                      </div>
                      <p className="text-xs sm:text-sm text-purple-700 break-words">
                        Enable AI-powered job matching system
                      </p>
                      <p className="text-xs text-purple-600 mt-1 break-words">1,234 matches made • 89% success rate</p>
                    </div>
                    <Switch defaultChecked className="flex-shrink-0" />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 mb-1">
                        <h4 className="font-medium text-green-900 text-sm sm:text-base break-words">Certifications</h4>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full w-fit">Active</span>
                      </div>
                      <p className="text-xs sm:text-sm text-green-700 break-words">
                        Allow students to earn course certifications
                      </p>
                      <p className="text-xs text-green-600 mt-1 break-words">
                        567 certificates issued • 78% completion rate
                      </p>
                    </div>
                    <Switch defaultChecked className="flex-shrink-0" />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 mb-1">
                        <h4 className="font-medium text-orange-900 text-sm sm:text-base break-words">Webinars</h4>
                        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full w-fit">Disabled</span>
                      </div>
                      <p className="text-xs sm:text-sm text-orange-700 break-words">
                        Enable live webinar functionality
                      </p>
                      <p className="text-xs text-orange-600 mt-1 break-words">
                        Feature in beta • 12 teachers interested
                      </p>
                    </div>
                    <Switch className="flex-shrink-0" />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col xs:flex-row xs:items-center gap-1 xs:gap-2 mb-1">
                        <h4 className="font-medium text-indigo-900 text-sm sm:text-base break-words">Analytics</h4>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full w-fit">Active</span>
                      </div>
                      <p className="text-xs sm:text-sm text-indigo-700 break-words">
                        Enable detailed analytics and reporting
                      </p>
                      <p className="text-xs text-indigo-600 mt-1 break-words">
                        124,567 data points • Real-time tracking
                      </p>
                    </div>
                    <Switch defaultChecked className="flex-shrink-0" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto text-sm">
                    Save Feature Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Settings Tab */}
          <TabsContent value="advanced" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                  <span className="break-words">Advanced Settings</span>
                </CardTitle>
                <CardDescription className="text-sm">Advanced system configuration and maintenance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-900 text-sm sm:text-base">Warning</h4>
                    <p className="text-sm text-red-700">
                      These settings can affect system performance and stability. Only modify if you understand the
                      implications.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div>
                      <h4 className="font-medium text-blue-900 text-sm sm:text-base">Database Backup</h4>
                      <p className="text-sm text-blue-700">Automatic daily database backups</p>
                    </div>
                    <Switch checked={autoBackup} onCheckedChange={setAutoBackup} />
                  </div>

                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-purple-900 text-sm sm:text-base">API Keys</h4>
                    </div>
                    <p className="text-sm text-purple-700">Manage system API keys and integrations</p>
                    <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                      Manage Keys
                    </Button>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-green-900 text-sm sm:text-base">System Logs</h4>
                    </div>
                    <p className="text-sm text-green-700">View and manage system logs and error reports</p>
                    <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                      View Logs
                    </Button>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-orange-900 text-sm sm:text-base">Notifications</h4>
                    </div>
                    <p className="text-sm text-orange-700">Configure system notifications and alerts</p>
                    <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                      Configure
                    </Button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto text-sm">
                    Save Advanced Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
