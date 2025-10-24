"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import BackButton from "@/components/back-button"
import {
  CreditCard,
  Users,
  DollarSign,
  TrendingUp,
  Calendar,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
} from "lucide-react"

const subscriptionStats = [
  {
    title: "Total Subscribers",
    value: "1,847",
    change: "+12.3%",
    trend: "up",
    subtitle: "Active subscriptions",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  {
    title: "Monthly Revenue",
    value: "$28,456",
    change: "+8.7%",
    trend: "up",
    subtitle: "Recurring revenue",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  {
    title: "Churn Rate",
    value: "2.1%",
    change: "-0.5%",
    trend: "down",
    subtitle: "Monthly churn",
    icon: TrendingUp,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
  {
    title: "Avg. LTV",
    value: "$2,340",
    change: "+15.2%",
    trend: "up",
    subtitle: "Customer lifetime value",
    icon: CreditCard,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
  },
]

const subscriptionPlans = [
  {
    id: 1,
    name: "Basic Plan",
    price: "$9.99",
    interval: "month",
    subscribers: 1247,
    revenue: "$12,456",
    status: "active",
    features: ["Access to basic courses", "Community support", "Mobile app access"],
  },
  {
    id: 2,
    name: "Pro Plan",
    price: "$19.99",
    interval: "month",
    subscribers: 456,
    revenue: "$9,123",
    status: "active",
    features: ["All basic features", "Premium courses", "1-on-1 mentoring", "Career guidance"],
  },
  {
    id: 3,
    name: "Enterprise Plan",
    price: "$49.99",
    interval: "month",
    subscribers: 144,
    revenue: "$7,199",
    status: "active",
    features: ["All pro features", "Team management", "Custom branding", "Priority support"],
  },
]

const recentSubscriptions = [
  {
    id: "SUB-001",
    user: "John Smith",
    email: "john@example.com",
    plan: "Pro Plan",
    status: "active",
    startDate: "2024-01-15",
    nextBilling: "2024-02-15",
    amount: "$19.99",
  },
  {
    id: "SUB-002",
    user: "Sarah Johnson",
    email: "sarah@example.com",
    plan: "Basic Plan",
    status: "active",
    startDate: "2024-01-14",
    nextBilling: "2024-02-14",
    amount: "$9.99",
  },
  {
    id: "SUB-003",
    user: "Mike Wilson",
    email: "mike@example.com",
    plan: "Enterprise Plan",
    status: "cancelled",
    startDate: "2024-01-10",
    nextBilling: "2024-02-10",
    amount: "$49.99",
  },
  {
    id: "SUB-004",
    user: "Emily Davis",
    email: "emily@example.com",
    plan: "Pro Plan",
    status: "past_due",
    startDate: "2024-01-12",
    nextBilling: "2024-02-12",
    amount: "$19.99",
  },
  {
    id: "SUB-005",
    user: "David Brown",
    email: "david@example.com",
    plan: "Basic Plan",
    status: "active",
    startDate: "2024-01-13",
    nextBilling: "2024-02-13",
    amount: "$9.99",
  },
]

const billingIssues = [
  {
    id: "ISSUE-001",
    user: "Alice Cooper",
    plan: "Pro Plan",
    issue: "Payment failed",
    amount: "$19.99",
    date: "2024-01-20",
    status: "pending",
  },
  {
    id: "ISSUE-002",
    user: "Bob Taylor",
    plan: "Enterprise Plan",
    issue: "Card expired",
    amount: "$49.99",
    date: "2024-01-19",
    status: "resolved",
  },
  {
    id: "ISSUE-003",
    user: "Carol White",
    plan: "Basic Plan",
    issue: "Insufficient funds",
    amount: "$9.99",
    date: "2024-01-18",
    status: "pending",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    case "past_due":
      return "bg-orange-100 text-orange-800"
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "resolved":
      return "bg-blue-100 text-blue-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
    case "cancelled":
      return <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
    case "past_due":
      return <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
    case "pending":
      return <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
    case "resolved":
      return <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
    default:
      return <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
  }
}

export default function AdminSubscriptions() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [searchTerm, setSearchTerm] = useState("")

  const filteredSubscriptions = recentSubscriptions.filter(
    (sub) =>
      sub.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.plan.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 pt-4">
       
      </div>

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl p-6 text-white">
            <div className="">
              <BackButton />
              <h1 className="text-xl sm:text-2xl font-bold text-white">Subscription Management</h1>
              <p className="text-sm sm:text-base text-white">
                Manage subscription plans, billing, and customer accounts
              </p>
            </div>
            {/* Updated header action buttons */}
            <div className="flex flex-wrap items-center gap-1 sm:gap-2 lg:gap-4">
              <Button
                variant="outline"
                className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 whitespace-nowrap shrink-0 leading-normal bg-transparent"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Export Data</span>
                <span className="sm:hidden">Export</span>
              </Button>
              <Button className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2 bg-emerald-600 hover:bg-emerald-700 whitespace-nowrap shrink-0 leading-normal">
                <CreditCard className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Create Plan</span>
                <span className="sm:hidden">Create</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {subscriptionStats.map((stat, index) => (
            <Card key={index} className={`hover:shadow-lg transition-shadow ${stat.bgColor}`}>
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center mt-1">
                      <TrendingUp
                        className={`h-3 w-3 sm:h-4 sm:w-4 mr-1 ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
                      />
                      <span
                        className={`text-xs sm:text-sm font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
                      >
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Subscription Management Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 gap-1 h-auto p-1">
            <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 py-2 sm:px-3 sm:py-2">
              Overview
            </TabsTrigger>
            <TabsTrigger value="plans" className="text-xs sm:text-sm px-2 py-2 sm:px-3 sm:py-2">
              Plans
            </TabsTrigger>
            <TabsTrigger value="subscribers" className="text-xs sm:text-sm px-2 py-2 sm:px-3 sm:py-2">
              Subscribers
            </TabsTrigger>
            <TabsTrigger value="billing" className="text-xs sm:text-sm px-2 py-2 sm:px-3 sm:py-2">
              <span className="hidden sm:inline">Billing Issues</span>
              <span className="sm:hidden">Billing</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Revenue Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Revenue by Plan
                  </CardTitle>
                  <CardDescription>Monthly recurring revenue breakdown</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {subscriptionPlans.map((plan) => (
                      <div key={plan.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{plan.name}</span>
                          <span className="text-sm text-gray-600">{plan.revenue}</span>
                        </div>
                        <Progress
                          value={(Number.parseInt(plan.revenue.replace(/[$,]/g, "")) / 28456) * 100}
                          className="h-2"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>{plan.subscribers} subscribers</span>
                          <span>
                            {plan.price}/{plan.interval}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Subscription Growth */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Growth Metrics
                  </CardTitle>
                  <CardDescription>Key subscription performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">New Subscriptions (30d)</span>
                      <Badge className="bg-green-100 text-green-800">+234</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Cancellations (30d)</span>
                      <Badge className="bg-red-100 text-red-800">-39</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Net Growth</span>
                      <Badge className="bg-blue-100 text-blue-800">+195</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Conversion Rate</span>
                      <Badge variant="outline">12.5%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="plans" className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              {subscriptionPlans.map((plan) => (
                <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3 sm:pb-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base sm:text-lg">{plan.name}</CardTitle>
                        <div className="flex items-baseline mt-1 sm:mt-2">
                          <span className="text-xl sm:text-2xl font-bold text-gray-900">{plan.price}</span>
                          <span className="text-sm sm:text-base text-gray-500 ml-1">/{plan.interval}</span>
                        </div>
                      </div>
                      <Badge className={getStatusColor(plan.status)}>{plan.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">Subscribers</span>
                          <span className="font-medium">{plan.subscribers}</span>
                        </div>
                        <div className="flex justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">Monthly Revenue</span>
                          <span className="font-medium">{plan.revenue}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-medium text-gray-900 mb-2">Features</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-2 shrink-0" />
                              <span className="break-words">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 pt-2 sm:pt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 bg-transparent min-h-[32px] sm:min-h-[36px] text-xs sm:text-sm"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 bg-transparent min-h-[32px] sm:min-h-[36px] text-xs sm:text-sm"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="subscribers" className="space-y-4 sm:space-y-6">
  {/* Search and Filter */}
  <Card>
    <CardContent className="p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search subscribers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
          />
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>
    </CardContent>
  </Card>

  {/* Subscribers Table - Hidden on mobile, shown on sm and above */}
  <Card className="hidden sm:block">
    <CardHeader>
      <CardTitle>Recent Subscriptions</CardTitle>
      <CardDescription>Latest subscription activities and status updates</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-medium text-gray-900">Subscriber</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Plan</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Next Billing</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
              <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredSubscriptions.map((subscription) => (
              <tr key={subscription.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div>
                    <div className="font-medium text-gray-900">{subscription.user}</div>
                    <div className="text-sm text-gray-500">{subscription.email}</div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-sm font-medium">{subscription.plan}</span>
                </td>
                <td className="py-3 px-4">
                  <Badge className={getStatusColor(subscription.status)}>
                    <div className="flex items-center">
                      {getStatusIcon(subscription.status)}
                      <span className="ml-1 capitalize">{subscription.status.replace("_", " ")}</span>
                    </div>
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-1" />
                    {subscription.nextBilling}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="font-medium">{subscription.amount}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </CardContent>
  </Card>

  {/* Mobile Cards View - Only shown on mobile, hidden on sm and above */}
  <Card className="sm:hidden">
    <CardHeader>
      <CardTitle>Recent Subscriptions</CardTitle>
      <CardDescription>Latest subscription activities and status updates</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {filteredSubscriptions.map((subscription) => (
          <div key={subscription.id} className="border rounded-lg p-4 bg-white space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">{subscription.user}</div>
                <div className="text-sm text-gray-500 truncate">{subscription.email}</div>
              </div>
              <Badge className={`${getStatusColor(subscription.status)} shrink-0 ml-2`}>
                <div className="flex items-center">
                  {getStatusIcon(subscription.status)}
                  <span className="ml-1 capitalize">{subscription.status.replace("_", " ")}</span>
                </div>
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-gray-500 text-xs">Plan</div>
                <div className="font-medium truncate">{subscription.plan}</div>
              </div>
              <div>
                <div className="text-gray-500 text-xs">Amount</div>
                <div className="font-medium">{subscription.amount}</div>
              </div>
            </div>
            
            <div className="text-sm">
              <div className="text-gray-500 text-xs">Next Billing</div>
              <div className="flex items-center font-medium">
                <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                {subscription.nextBilling}
              </div>
            </div>
            
            <div className="flex space-x-2 pt-2">
              <Button size="sm" variant="outline" className="flex-1">
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
              <Button size="sm" variant="outline" className="flex-1">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
</TabsContent>

          <TabsContent value="billing" className="space-y-4 sm:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-orange-600" />
                  Billing Issues
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Payment failures and billing problems requiring attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {billingIssues.map((issue) => (
                    <div
                      key={issue.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 border rounded-lg hover:bg-gray-50 gap-2 sm:gap-4"
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                        <div className="p-1.5 sm:p-2 rounded-full bg-orange-100 shrink-0">
                          <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm sm:text-base font-medium text-gray-900 truncate">{issue.user}</div>
                          <div className="text-xs sm:text-sm text-gray-500 break-words">
                            {issue.plan} • {issue.issue}
                          </div>
                          <div className="text-xs text-gray-400">{issue.date}</div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 sm:shrink-0">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <span className="text-sm sm:text-base font-medium">{issue.amount}</span>
                          <Badge className={`${getStatusColor(issue.status)} text-xs`}>{issue.status}</Badge>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full sm:w-auto bg-transparent text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                        >
                          Resolve
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}