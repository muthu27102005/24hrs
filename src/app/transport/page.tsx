'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface TransportEntry {
  id: string;
  type: 'car' | 'public_transit' | 'cycling' | 'walking' | 'electric_vehicle';
  distance: number;
  date: string;
  co2Saved: number;
  points: number;
  vehicleType?: string;
}

type TripType = TransportEntry['type'];

interface NewTripState {
  type: TripType;
  vehicleType: string;
  distance: string;
}

interface UserStats {
  userId: string;
  username: string;
  totalCO2Saved: number;
  totalPoints: number;
  trips: number;
  rank: number;
}

interface Reward {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: string;
  category: string;
}

interface RedeemedReward {
  id: string;
  rewardId: string;
  rewardName: string;
  redeemedDate: string;
}

// Detailed CO2 Emissions by Vehicle Type
const CO2_EMISSIONS = {
  car: { sedan: 0.21, suv: 0.28, hatchback: 0.18, truck: 0.35 },
  public_transit: { bus: 0.041, train: 0.025, metro: 0.03, tram: 0.026 },
  cycling: 0,
  walking: 0,
  electric_vehicle: { tesla: 0.05, generic_ev: 0.07, hybrid: 0.12 },
};

// Points System - More generous for eco-friendly choices
const POINTS_PER_KM = {
  car_sedan: 10,
  car_suv: 15,
  car_hatchback: 8,
  car_truck: 20,
  public_transit_bus: 75,
  public_transit_train: 85,
  public_transit_metro: 80,
  public_transit_tram: 78,
  cycling: 100,
  walking: 120,
  electric_vehicle_tesla: 60,
  electric_vehicle_generic: 50,
};

// Reward Items Available
const REWARDS_CATALOG: Reward[] = [
  { id: 'tree', name: 'Plant a Tree', description: 'Plant 1 tree in your name', cost: 500, icon: '🌳', category: 'environment' },
  { id: 'bottle', name: 'Reusable Water Bottle', description: '500ml eco-friendly bottle', cost: 250, icon: '🌊', category: 'merchandise' },
  { id: 'bag', name: 'Eco Tote Bag', description: 'Organic cotton shopping bag', cost: 150, icon: '👜', category: 'merchandise' },
  { id: 'food', name: '$10 Food Delivery Credit', description: 'Eco-friendly restaurants', cost: 300, icon: '🍔', category: 'voucher' },
  { id: 'bike', name: 'Free Bike Service', description: 'Complete bike maintenance', cost: 400, icon: '🔧', category: 'service' },
  { id: 'transit', name: '$25 Transit Pass Credit', description: 'Bonus public transit credit', cost: 350, icon: '🎟️', category: 'voucher' },
  { id: 'charger', name: 'Solar Phone Charger', description: 'Portable solar charging', cost: 600, icon: '☀️', category: 'merchandise' },
  { id: 'co2', name: 'Offset 1 Ton CO2', description: 'Carbon reduction projects', cost: 800, icon: '💨', category: 'environment' },
];

// Supabase client configuration
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

export default function TransportPage() {
  const [entries, setEntries] = useState<TransportEntry[]>([
    { id: '1', type: 'public_transit', distance: 15, date: '2026-03-10', co2Saved: 2.64, points: 750, vehicleType: 'bus' },
    { id: '2', type: 'cycling', distance: 8, date: '2026-03-09', co2Saved: 1.68, points: 800 },
    { id: '3', type: 'car', distance: 25, date: '2026-03-08', co2Saved: 0, points: 0, vehicleType: 'sedan' },
  ]);

  const [redeemedRewards, setRedeemedRewards] = useState<RedeemedReward[]>([]);
  const [leaderboard, setLeaderboard] = useState<UserStats[]>([
    { userId: '1', username: 'You', totalCO2Saved: 4.32, totalPoints: 1550, trips: 3, rank: 1 },
    { userId: '2', username: 'Alex Green', totalCO2Saved: 3.85, totalPoints: 1420, trips: 5, rank: 2 },
    { userId: '3', username: 'Jordan Eco', totalCO2Saved: 3.5, totalPoints: 1380, trips: 4, rank: 3 },
    { userId: '4', username: 'Casey Climate', totalCO2Saved: 2.9, totalPoints: 1120, trips: 3, rank: 4 },
    { userId: '5', username: 'Morgan Sustainable', totalCO2Saved: 2.4, totalPoints: 980, trips: 2, rank: 5 },
  ]);

  const [newTrip, setNewTrip] = useState<NewTripState>({
    type: 'public_transit',
    vehicleType: 'bus',
    distance: '',
  });
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rewards'>('dashboard');
  const [loading, setLoading] = useState(false);

  const totalCO2Saved = entries.reduce((acc, entry) => acc + entry.co2Saved, 0);
  const totalPoints = entries.reduce((acc, entry) => acc + entry.points, 0);
  const yourStats = leaderboard.find(user => user.userId === '1');

  // Calculate CO2 saved based on detailed vehicle type
  const calculateCO2 = (type: string, vehicleType: string, distance: number) => {
    let carEmissions = 0.21;
    let currentEmissions = 0;
    if (type === 'car') {
      const carTypes = CO2_EMISSIONS.car as Record<string, number>;
      carEmissions = carTypes[vehicleType] || 0.21;
      currentEmissions = carEmissions;
    } else if (type === 'public_transit') {
      const transitTypes = CO2_EMISSIONS.public_transit as Record<string, number>;
      currentEmissions = transitTypes[vehicleType] || 0.041;
    } else {
      currentEmissions = (CO2_EMISSIONS[type as keyof typeof CO2_EMISSIONS] as number) || 0;
    }
    return (carEmissions - currentEmissions) * distance;
  };

  // Calculate points based on detailed vehicle type
  const calculatePoints = (type: string, vehicleType: string, distance: number) => {
    const key = `${type}_${vehicleType}`;
    const pointsPerKm = (POINTS_PER_KM[key as keyof typeof POINTS_PER_KM] || 50);
    return Math.round(pointsPerKm * distance);
  };

  const handleAddTrip = () => {
    if (!newTrip.distance) return;
    const distance = parseFloat(newTrip.distance);
    const co2Saved = calculateCO2(newTrip.type, newTrip.vehicleType, distance);
    const points = calculatePoints(newTrip.type, newTrip.vehicleType, distance);

    const entry: TransportEntry = {
      id: Date.now().toString(),
      type: newTrip.type,
      distance,
      date: new Date().toISOString().split('T')[0],
      co2Saved,
      points,
      vehicleType: newTrip.vehicleType,
    };

    setEntries([...entries, entry]);
    setNewTrip({ type: 'public_transit', vehicleType: 'bus', distance: '' });
    console.log('Saving trip to Supabase:', entry);
  };

  const handleRedeemReward = (reward: Reward) => {
    if (totalPoints < reward.cost) {
      alert('Not enough points!');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const redeemed: RedeemedReward = {
        id: Date.now().toString(),
        rewardId: reward.id,
        rewardName: reward.name,
        redeemedDate: new Date().toISOString().split('T')[0],
      };

      setRedeemedRewards([...redeemedRewards, redeemed]);

      const newEntries = [...entries];
      let remaining = reward.cost;
      for (let i = newEntries.length - 1; i >= 0 && remaining > 0; i--) {
        const deduct = Math.min(newEntries[i].points, remaining);
        newEntries[i].points -= deduct;
        remaining -= deduct;
      }
      setEntries(newEntries);

      setLoading(false);
      alert(`🎉 "${reward.name}" redeemed successfully!`);
      console.log('Saving redeemed reward to Supabase:', redeemed);
    }, 800);
  };

  const weeklyData = [
    { day: 'Mon', co2: 0.5, points: 200 },
    { day: 'Tue', co2: 1.2, points: 400 },
    { day: 'Wed', co2: 0.8, points: 350 },
    { day: 'Thu', co2: 1.5, points: 500 },
    { day: 'Fri', co2: 2.1, points: 650 },
    { day: 'Sat', co2: 0.3, points: 100 },
    { day: 'Sun', co2: 1.8, points: 600 },
  ];

  const transportBreakdown = [
    { name: 'Public Transit', value: entries.filter(e => e.type === 'public_transit').length, color: '#3b82f6' },
    { name: 'Cycling', value: entries.filter(e => e.type === 'cycling').length, color: '#10b981' },
    { name: 'Car', value: entries.filter(e => e.type === 'car').length, color: '#ef4444' },
    { name: 'Walking', value: entries.filter(e => e.type === 'walking').length, color: '#f59e0b' },
    { name: 'EV', value: entries.filter(e => e.type === 'electric_vehicle').length, color: '#8b5cf6' },
  ].filter(item => item.value > 0);

  const getTransportIcon = (type: string) => {
    const icons: Record<string, string> = { car: '🚗', public_transit: '🚌', cycling: '🚴', walking: '🚶', electric_vehicle: '⚡' };
    return icons[type] || '🚗';
  };

  const getTransportLabel = (type: string) => {
    const labels: Record<string, string> = { car: 'Car', public_transit: 'Public Transit', cycling: 'Cycling', walking: 'Walking', electric_vehicle: 'EV' };
    return labels[type] || type;
  };

  const getVehicleOptions = () => {
    if (newTrip.type === 'car') return ['sedan', 'suv', 'hatchback', 'truck'];
    if (newTrip.type === 'public_transit') return ['bus', 'train', 'metro', 'tram'];
    if (newTrip.type === 'electric_vehicle') return ['tesla', 'generic_ev', 'hybrid'];
    return [];
  };

  const rewardsByCategory = {
    environment: REWARDS_CATALOG.filter(r => r.category === 'environment'),
    merchandise: REWARDS_CATALOG.filter(r => r.category === 'merchandise'),
    voucher: REWARDS_CATALOG.filter(r => r.category === 'voucher'),
    service: REWARDS_CATALOG.filter(r => r.category === 'service'),
  };

  const RewardCard = ({ reward }: { reward: Reward }) => (
    <Card className="p-6 bg-white shadow-lg hover:shadow-xl transition-shadow">
      <div className="text-5xl mb-3">{reward.icon}</div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{reward.name}</h3>
      <p className="text-sm text-gray-600 mb-4">{reward.description}</p>
      <div className="flex justify-between items-center">
        <div className="text-2xl font-bold text-blue-600">{reward.cost}pts</div>
        <Button
          onClick={() => handleRedeemReward(reward)}
          disabled={totalPoints < reward.cost || loading}
          className={`${
            totalPoints >= reward.cost ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'
          } text-white font-bold py-2 px-4 rounded-lg`}
        >
          {totalPoints < reward.cost ? 'Locked' : 'Redeem'}
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-green-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">🌍 Transport Tracker</h1>
          <p className="text-lg text-gray-600">Track sustainability & compete on leaderboard</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'dashboard' ? 'bg-blue-500 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            📊 Dashboard
          </button>
          <button
            onClick={() => setActiveTab('rewards')}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              activeTab === 'rewards' ? 'bg-blue-500 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🎁 Rewards
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="p-6 bg-white shadow-lg border-t-4 border-green-500">
                <div className="text-sm text-gray-600 mb-2">CO2 Saved</div>
                <div className="text-3xl font-bold text-green-600">{totalCO2Saved.toFixed(2)} kg</div>
              </Card>
              <Card className="p-6 bg-white shadow-lg border-t-4 border-blue-500">
                <div className="text-sm text-gray-600 mb-2">Eco Points</div>
                <div className="text-3xl font-bold text-blue-600">{totalPoints}</div>
              </Card>
              <Card className="p-6 bg-white shadow-lg border-t-4 border-purple-500">
                <div className="text-sm text-gray-600 mb-2">Trips</div>
                <div className="text-3xl font-bold text-purple-600">{entries.length}</div>
              </Card>
              <Card className="p-6 bg-white shadow-lg border-t-4 border-orange-500">
                <div className="text-sm text-gray-600 mb-2">Avg Distance</div>
                <div className="text-3xl font-bold text-orange-600">{(entries.reduce((acc, e) => acc + e.distance, 0) / entries.length || 0).toFixed(1)} km</div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Add Trip */}
                <Card className="p-6 bg-white shadow-lg">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">➕ Log a Trip</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Transport Mode</label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                        {(['public_transit', 'cycling', 'walking', 'electric_vehicle', 'car'] as const).map((mode) => (
                          <button
                            key={mode}
                            onClick={() => setNewTrip({ ...newTrip, type: mode, vehicleType: mode === 'public_transit' ? 'bus' : mode === 'electric_vehicle' ? 'tesla' : mode === 'car' ? 'sedan' : '' })}
                            className={`p-3 rounded-lg border-2 text-center transition-all ${
                              newTrip.type === mode ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="text-2xl mb-1">{getTransportIcon(mode)}</div>
                            <div className="text-xs font-medium">{getTransportLabel(mode).split(' ')[0]}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {getVehicleOptions().length > 0 && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle Type</label>
                        <select
                          value={newTrip.vehicleType}
                          onChange={(e) => setNewTrip({ ...newTrip, vehicleType: e.target.value })}
                          className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {getVehicleOptions().map((option) => (
                            <option key={option} value={option}>
                              {option.charAt(0).toUpperCase() + option.slice(1).replace('_', ' ')}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Distance (km)</label>
                      <Input
                        type="number"
                        placeholder="Enter distance"
                        value={newTrip.distance}
                        onChange={(e) => setNewTrip({ ...newTrip, distance: e.target.value })}
                        className="w-full"
                      />
                    </div>

                    <Button onClick={handleAddTrip} className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-lg">
                      Log Trip
                    </Button>
                  </div>
                </Card>

                {/* Charts */}
                <Card className="p-6 bg-white shadow-lg">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Weekly Activity</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="co2" fill="#10b981" name="CO2 Saved (kg)" />
                      <Bar dataKey="points" fill="#3b82f6" name="Points" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="p-6 bg-white shadow-lg">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">🚗 Transport Breakdown</h2>
                  {transportBreakdown.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie data={transportBreakdown} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={100} fill="#8884d8" dataKey="value">
                          {transportBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="text-center py-12 text-gray-500">No trips yet</div>
                  )}
                </Card>

                {/* Recent Trips */}
                <Card className="p-6 bg-white shadow-lg">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">📝 Recent Trips</h2>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {entries.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">No trips yet</div>
                    ) : (
                      entries
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((entry) => (
                          <div key={entry.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100">
                            <div className="flex items-center gap-4">
                              <div className="text-2xl">{getTransportIcon(entry.type)}</div>
                              <div>
                                <div className="font-semibold text-gray-900">{getTransportLabel(entry.type)}</div>
                                <div className="text-sm text-gray-500">{entry.date} {entry.vehicleType && `• ${entry.vehicleType}`}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-green-600">{entry.distance} km</div>
                              <div className="text-sm text-gray-500">+{entry.points} pts</div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </Card>
              </div>

              {/* Leaderboard */}
              <div>
                <Card className="p-6 bg-white shadow-lg">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">🏆 Leaderboard</h2>
                  <div className="space-y-2">
                    {leaderboard.map((user) => (
                      <div
                        key={user.userId}
                        className={`p-4 rounded-lg transition-colors ${
                          user.userId === '1' ? 'bg-blue-50 border-2 border-blue-500' : user.rank === 2 ? 'bg-gray-50 border-l-4 border-gray-400' : user.rank === 3 ? 'bg-orange-50 border-l-4 border-orange-400' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <div className="text-2xl font-bold text-gray-600 w-8 text-center">
                              {user.rank === 1 ? '🥇' : user.rank === 2 ? '🥈' : user.rank === 3 ? '🥉' : user.rank}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">{user.username}</div>
                              <div className="text-xs text-gray-500">{user.trips} trips</div>
                            </div>
                          </div>
                        </div>
                        <div className="ml-11 space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Points:</span>
                            <span className="font-bold text-blue-600">{user.totalPoints}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">CO2:</span>
                            <span className="font-bold text-green-600">{user.totalCO2Saved.toFixed(2)} kg</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h3 className="font-bold text-gray-900 mb-3">🎖️ Badges</h3>
                    <div className="space-y-2">
                      {totalCO2Saved > 0 && (
                        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                          <span className="text-2xl">🌱</span>
                          <div>
                            <div className="text-sm font-bold">Eco Warrior</div>
                            <div className="text-xs text-gray-600">Saved {totalCO2Saved.toFixed(2)}kg CO2</div>
                          </div>
                        </div>
                      )}
                      {entries.length >= 3 && (
                        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                          <span className="text-2xl">🚀</span>
                          <div>
                            <div className="text-sm font-bold">Consistent Rider</div>
                            <div className="text-xs text-gray-600">{entries.length} trips logged</div>
                          </div>
                        </div>
                      )}
                      {entries.some(e => e.type === 'cycling' || e.type === 'walking') && (
                        <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                          <span className="text-2xl">🚴</span>
                          <div>
                            <div className="text-sm font-bold">Active Commuter</div>
                            <div className="text-xs text-gray-600">Chose active transport</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </>
        )}

        {activeTab === 'rewards' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Card className="p-6 bg-white shadow-lg sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Points</h2>
                <div className="text-5xl font-bold text-blue-600 mb-4">{totalPoints}</div>
                <div className="text-sm text-gray-600 mb-6">Available to spend</div>

                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm font-semibold text-blue-900 mb-2">💡 Tip</div>
                  <div className="text-xs text-blue-800">Keep logging sustainable trips to earn more points!</div>
                </div>

                {redeemedRewards.length > 0 && (
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3">🎉 Redeemed</h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {redeemedRewards.map((reward) => (
                        <div key={reward.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="font-semibold text-green-900 text-sm">{reward.rewardName}</div>
                          <div className="text-xs text-green-700">{reward.redeemedDate}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            </div>

            <div className="lg:col-span-3">
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">🌳 Environmental Impact</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rewardsByCategory.environment.map((reward) => (
                      <RewardCard key={reward.id} reward={reward} />
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">🛍️ Eco Merchandise</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rewardsByCategory.merchandise.map((reward) => (
                      <RewardCard key={reward.id} reward={reward} />
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">🎟️ Vouchers & Credits</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rewardsByCategory.voucher.map((reward) => (
                      <RewardCard key={reward.id} reward={reward} />
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">🔧 Services</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rewardsByCategory.service.map((reward) => (
                      <RewardCard key={reward.id} reward={reward} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
