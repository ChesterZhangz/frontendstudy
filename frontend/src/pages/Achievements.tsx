import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Target, 
  Award, 
  Star, 
  Clock, 
  BookOpen, 
  Zap, 
  Flame, 
  Calendar,
  CheckCircle,
  Play,
  Sunrise,
  Moon,
  Code,
  Palette
} from 'lucide-react';
import achievementService, { Achievement, AchievementStats, LeaderboardEntry } from '@/services/achievementService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// 图标映射
const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
  Trophy,
  Target,
  Award,
  Star,
  Clock,
  BookOpen,
  Zap,
  Flame,
  Calendar,
  CheckCircle,
  Play,
  Sunrise,
  Moon,
  Code,
  Palette
};

const Achievements: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'achievements' | 'charts'>('achievements');
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState<AchievementStats | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [achievementsData, statsData, leaderboardData] = await Promise.all([
        achievementService.getUserAchievements(),
        achievementService.getAchievementStats(),
        achievementService.getLeaderboard(10)
      ]);

      setAchievements(achievementsData);
      setStats(statsData);
      setLeaderboard(leaderboardData);
    } catch (error: any) {
      console.error('加载成就数据失败:', error);
      setError(error.message || '加载数据失败');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">正在加载成就数据...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">加载失败</h3>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
          </div>
          <button
            onClick={loadData}
            className="ml-auto text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和切换 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">成就系统</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">查看你的学习成就和进度统计</p>
          </div>
          
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('achievements')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'achievements'
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              我的成就
            </button>
            <button
              onClick={() => setActiveTab('charts')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === 'charts'
                  ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              成就图表
            </button>
          </div>
        </div>

        {/* 总体统计 */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center">
                <Trophy className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">已获得成就</p>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{stats.completed}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center">
                <Target className="w-8 h-8 text-green-600 dark:text-green-400" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">完成率</p>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-300">{stats.completionRate}%</p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
              <div className="flex items-center">
                <Star className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">总积分</p>
                  <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">{stats.totalPoints}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <div className="flex items-center">
                <Award className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">总成就数</p>
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{stats.total}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 内容区域 */}
      {activeTab === 'achievements' ? (
        <AchievementsList achievements={achievements} />
      ) : (
        <AchievementCharts stats={stats} leaderboard={leaderboard} />
      )}
    </div>
  );
};

// 成就列表组件
const AchievementsList: React.FC<{ achievements: Achievement[] }> = ({ achievements }) => {
  const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');
  const [sortBy, setSortBy] = useState<'rarity' | 'points' | 'progress'>('rarity');

  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName] || Trophy;
    return IconComponent;
  };

  const filteredAchievements = achievements.filter(achievement => {
    if (filter === 'completed') return achievement.isCompleted;
    if (filter === 'incomplete') return !achievement.isCompleted;
    return true;
  });

  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    if (sortBy === 'rarity') {
      const rarityOrder = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 };
      return rarityOrder[b.rarity] - rarityOrder[a.rarity];
    }
    if (sortBy === 'points') return b.points - a.points;
    if (sortBy === 'progress') return (b.progress || 0) - (a.progress || 0);
    return 0;
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
      {/* 筛选和排序 */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'all'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'completed'
                  ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              已完成
            </button>
            <button
              onClick={() => setFilter('incomplete')}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                filter === 'incomplete'
                  ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              未完成
            </button>
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
          >
            <option value="rarity">按稀有度排序</option>
            <option value="points">按积分排序</option>
            <option value="progress">按进度排序</option>
          </select>
        </div>
      </div>

      {/* 成就列表 */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedAchievements.map((achievement) => {
            const IconComponent = getIcon(achievement.icon);
            const rarityColor = achievementService.getRarityColor(achievement.rarity);
            
            return (
              <div
                key={achievement._id}
                className={`relative p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg ${
                  achievement.isCompleted
                    ? 'border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                }`}
              >
                {/* 稀有度标签 */}
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${rarityColor}`}>
                  {achievementService.getRarityName(achievement.rarity)}
                </div>

                {/* 完成状态 */}
                {achievement.isCompleted && (
                  <div className="absolute top-3 left-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  </div>
                )}

                {/* 图标和标题 */}
                <div className="flex items-center mb-4 mt-2">
                  <div className={`p-3 rounded-xl ${
                    achievement.isCompleted
                      ? 'bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{achievement.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.points} 积分</p>
                  </div>
                </div>

                {/* 描述 */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{achievement.description}</p>

                {/* 进度条 */}
                {!achievement.isCompleted && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>进度</span>
                      <span>{achievement.progress || 0}/{achievement.requirement.target}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min(((achievement.progress || 0) / achievement.requirement.target) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* 完成时间 */}
                {achievement.isCompleted && achievement.unlockedAt && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    完成于 {new Date(achievement.unlockedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {sortedAchievements.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {filter === 'completed' ? '还没有完成的成就' : '没有找到成就'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {filter === 'completed' ? '继续学习来解锁你的第一个成就吧！' : '尝试调整筛选条件'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// 成就图表组件
const AchievementCharts: React.FC<{ 
  stats: AchievementStats | null; 
  leaderboard: LeaderboardEntry[];
}> = ({ stats, leaderboard }) => {
  if (!stats) return null;

  const rarityData = [
    { name: '普通', value: stats.rarityDistribution.common, color: '#6B7280' },
    { name: '少见', value: stats.rarityDistribution.uncommon, color: '#10B981' },
    { name: '稀有', value: stats.rarityDistribution.rare, color: '#3B82F6' },
    { name: '史诗', value: stats.rarityDistribution.epic, color: '#8B5CF6' },
    { name: '传说', value: stats.rarityDistribution.legendary, color: '#F59E0B' }
  ].filter(item => item.value > 0);

  const leaderboardData = leaderboard.map((entry) => ({
    name: entry.user?.name || `用户${entry.userId.slice(-4)}`,
    points: entry.points,
    rank: entry.rank
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 稀有度分布 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">成就稀有度分布</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={rarityData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
                label={({ name, value }: any) => `${name}: ${value}`}
              >
                {rarityData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 积分排行榜 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">积分排行榜</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={leaderboardData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="points" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 详细排行榜 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">详细排行榜</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">排名</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">用户</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">积分</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">完成课程</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">学习时长</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">连续天数</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr key={`leaderboard-${entry.rank}-${index}`} className="border-b border-gray-100 dark:border-gray-700">
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        entry.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                        entry.rank === 2 ? 'bg-gray-100 text-gray-800' :
                        entry.rank === 3 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {entry.rank}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {entry.user?.name || `用户${entry.userId.slice(-4)}`}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{entry.points}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{entry.completedCourses}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{entry.studyTime}分钟</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{entry.streak}天</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
