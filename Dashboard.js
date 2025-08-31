import { useState, useEffect } from 'react';
import {
  Bell, Users, CreditCard, AlertTriangle, XCircle, Clock,
  BarChart3, PieChart, Settings, LogOut, Menu, X, RefreshCw
} from 'lucide-react';

export default function FraudDetectionDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Data states - connect to your APIs
  const [kpiData, setKpiData] = useState({
    totalTransactions: null,
    flaggedTransactions: null,
    falsePositives: null,
    recentAlerts: null,
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [systemStatus, setSystemStatus] = useState({
    mlModel: 'disconnected',
    database: 'disconnected',
    apiStatus: 'disconnected',
  });

  // Simulate periodic data refresh
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 700);
    const interval = setInterval(() => setLastUpdated(new Date()), 30000);
    return () => clearInterval(interval);
  }, [selectedTimeRange]);

  const Sidebar = () => (
    <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-white" />
          </div>
          <span className="ml-3 text-xl font-bold text-gray-900">FraudGuard</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden p-2 rounded-md hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <nav className="mt-6">
        <div className="px-4 space-y-2">
          {[{ id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'transactions', label: 'Transactions', icon: CreditCard },
            { id: 'alerts', label: 'Alerts', icon: AlertTriangle, badge: kpiData.recentAlerts || 0 },
            { id: 'users', label: 'User Profiles', icon: Users },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                currentPage === item.id
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <button className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </nav>
    </div>
  );

  const KPICard = ({ title, value, icon: Icon, color, isLoading: cardLoading }) => (
    <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {cardLoading ? (
              <span className="animate-pulse bg-gray-200 rounded px-4 py-2" />
            ) : value !== null ? (
              value.toLocaleString()
            ) : (
              <span className="text-gray-400">--</span>
            )}
          </p>
        </div>
        <div className={`p-3 rounded-2xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  const ChartPlaceholder = ({ title, endpoint }) => (
    <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <button
          onClick={() => setLastUpdated(new Date())}
          className="p-2 hover:bg-gray-100 rounded-lg"
          disabled={isLoading}
        >
          <RefreshCw className={`w-4 h-4 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>
      <div className="h-56 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300">
        <PieChart className="w-14 h-14 text-blue-400" />
        <span className="text-sm text-gray-600 ml-5">Connect to <code>{endpoint}</code></span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <div className="lg:pl-64">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md hover:bg-gray-100"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="ml-2 text-xl font-bold text-gray-900">Dashboard</h1>
              <div className="ml-4 flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="text-sm border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
              <button
                onClick={() => setLastUpdated(new Date())}
                className="p-2 hover:bg-gray-100 rounded-lg"
                disabled={isLoading}
              >
                <RefreshCw className={`w-5 h-5 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell className="w-5 h-5 text-gray-600" />
                {kpiData.recentAlerts && kpiData.recentAlerts > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                )}
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">AD</span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4">
          {/* Connection Status */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mr-3"></div>
              <span className="text-sm text-blue-800 font-medium">Real-time monitoring active</span>
            </div>
            <div className="text-xs text-blue-600">API Endpoints: Ready for integration</div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <KPICard title="Total Transactions" value={kpiData.totalTransactions} icon={CreditCard} color="bg-blue-500" isLoading={isLoading} />
            <KPICard title="Flagged Transactions" value={kpiData.flaggedTransactions} icon={AlertTriangle} color="bg-red-500" isLoading={isLoading} />
            <KPICard title="False Positives" value={kpiData.falsePositives} icon={XCircle} color="bg-yellow-500" isLoading={isLoading} />
            <KPICard title="Recent Alerts" value={kpiData.recentAlerts} icon={Bell} color="bg-purple-500" isLoading={isLoading} />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            <ChartPlaceholder title="Transaction Volume Over Time" endpoint="/api/analytics/transaction-volume" />
            <ChartPlaceholder title="Suspicious Activity Trends" endpoint="/api/analytics/suspicious-trends" />
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
              <button className="px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg" onClick={() => setCurrentPage('transactions')}>View All</button>
            </div>
            <div className="p-4">
              {recentTransactions.length === 0 ? (
                <div className="text-center text-gray-500">No transactions in the selected timeframe.</div>
              ) : (
                <div className="space-y-3">
                  {recentTransactions.map(t => (
                    <div key={t.id} className="flex items-center justify-between border-b last:border-0 py-2">
                      <div>
                        <span className="font-semibold">{t.id}</span> - {t.merchant} - ₹{t.amount}
                        {t.flagged && <span className="ml-2 px-2 py-1 text-xs bg-red-100 text-red-600 rounded">Flagged</span>}
                      </div>
                      <span className="text-xs text-gray-400">{t.user}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Recent Alerts</h3>
              <button className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg" onClick={() => setCurrentPage('alerts')}>View All</button>
            </div>
            <div className="p-4">
              {recentAlerts.length === 0 ? (
                <div className="text-center text-gray-500">No active alerts.</div>
              ) : (
                <div className="space-y-3">
                  {recentAlerts.map(a => (
                    <div key={a.id} className="flex items-center justify-between border-b last:border-0 py-2">
                      <div>
                        <span className="font-semibold">{a.id}</span> - {a.reason}
                        <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">{a.status}</span>
                      </div>
                      <span className="text-xs text-gray-400">{a.transactionId}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">System Status</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {['mlModel', 'database', 'apiStatus'].map((key) => (
                <div key={key} className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    systemStatus[key] === 'active' || systemStatus[key] === 'connected' || systemStatus[key] === 'monitoring'
                    ? 'bg-green-500 animate-pulse'
                    : systemStatus[key] === 'loading'
                    ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{key === 'mlModel' ? 'ML Model' : key.charAt(0).toUpperCase() + key.slice(1)}</p>
                    <p className={`text-xs capitalize ${
                      systemStatus[key] === 'active' || systemStatus[key] === 'connected' || systemStatus[key] === 'monitoring'
                      ? 'text-green-600'
                      : systemStatus[key] === 'loading'
                      ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {systemStatus[key]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
