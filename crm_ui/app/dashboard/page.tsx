import {
  Users,
  DollarSign,
  TrendingUp,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  UserPlus,
  ShoppingBag,
  MessageSquare,
} from "lucide-react";

const stats = [
  {
    name: "Total Customers",
    value: "12,847",
    change: "+12.5%",
    isPositive: true,
    icon: Users,
    gradient: "from-violet-500 to-purple-600",
    shadowColor: "shadow-violet-500/25",
  },
  {
    name: "Revenue",
    value: "$284,392",
    change: "+8.2%",
    isPositive: true,
    icon: DollarSign,
    gradient: "from-emerald-500 to-teal-600",
    shadowColor: "shadow-emerald-500/25",
  },
  {
    name: "Active Leads",
    value: "3,142",
    change: "-2.4%",
    isPositive: false,
    icon: TrendingUp,
    gradient: "from-amber-500 to-orange-600",
    shadowColor: "shadow-amber-500/25",
  },
  {
    name: "Tasks Completed",
    value: "89%",
    change: "+5.1%",
    isPositive: true,
    icon: CheckCircle,
    gradient: "from-cyan-500 to-blue-600",
    shadowColor: "shadow-cyan-500/25",
  },
];

const recentActivities = [
  {
    id: 1,
    type: "customer",
    message: "New customer registered",
    name: "John Smith",
    time: "5 min ago",
    icon: UserPlus,
    iconBg: "bg-emerald-500/20",
    iconColor: "text-emerald-400",
  },
  {
    id: 2,
    type: "order",
    message: "New order placed",
    name: "Order #12847",
    time: "15 min ago",
    icon: ShoppingBag,
    iconBg: "bg-violet-500/20",
    iconColor: "text-violet-400",
  },
  {
    id: 3,
    type: "message",
    message: "Support ticket received",
    name: "Issue #3421",
    time: "32 min ago",
    icon: MessageSquare,
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-400",
  },
  {
    id: 4,
    type: "customer",
    message: "Customer upgraded plan",
    name: "Sarah Wilson",
    time: "1 hour ago",
    icon: TrendingUp,
    iconBg: "bg-cyan-500/20",
    iconColor: "text-cyan-400",
  },
];

const quickActions = [
  {
    name: "Add Customer",
    icon: UserPlus,
    color: "from-violet-500 to-purple-600",
  },
  {
    name: "Create Order",
    icon: ShoppingBag,
    color: "from-emerald-500 to-teal-600",
  },
  {
    name: "View Reports",
    icon: TrendingUp,
    color: "from-amber-500 to-orange-600",
  },
  {
    name: "Send Message",
    icon: MessageSquare,
    color: "from-cyan-500 to-blue-600",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-white">Welcome back, Admin!</h1>
        <p className="text-slate-400">
          Here&apos;s what&apos;s happening with your business today.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 transition-all duration-300 hover:bg-slate-800/70 hover:border-slate-600/50 hover:scale-[1.02] group"
            >
              <div
                className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${stat.gradient} rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity`}
              />

              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400">
                    {stat.name}
                  </p>
                  <p className="text-3xl font-bold text-white mt-2">
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    {stat.isPositive ? (
                      <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-400" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        stat.isPositive ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-xs text-slate-500">
                      vs last month
                    </span>
                  </div>
                </div>
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} ${stat.shadowColor} shadow-lg`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">
              Recent Activity
            </h2>
            <button className="text-sm text-violet-400 hover:text-violet-300 transition-colors">
              View all
            </button>
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-slate-900/50 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-200 hover:bg-slate-900/80"
                >
                  <div className={`p-3 rounded-xl ${activity.iconBg}`}>
                    <Icon className={`w-5 h-5 ${activity.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">
                      {activity.message}
                    </p>
                    <p className="text-sm text-slate-400 truncate">
                      {activity.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs">{activity.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6">
          <h2 className="text-xl font-semibold text-white mb-6">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.name}
                  className="group flex flex-col items-center gap-3 p-4 rounded-xl bg-slate-900/50 border border-slate-700/30 hover:border-slate-600/50 transition-all duration-200 hover:bg-slate-900/80 hover:scale-105"
                >
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${action.color} shadow-lg group-hover:shadow-xl transition-shadow`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                    {action.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-300">
                Weekly Performance
              </span>
              <span className="text-xs text-emerald-400 font-medium">+24%</span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-1000"
                style={{ width: "78%" }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              78% of weekly target achieved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
