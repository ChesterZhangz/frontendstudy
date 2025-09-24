import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useStudyStore } from '@/stores/studyStore';
import { getTotalCourses, allCourses } from '@/data/courses';
import LoadingScreen from '@/components/ui/LoadingScreen';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    stats, 
    progress, 
    fetchStats, 
    fetchProgress, 
    fetchCourses,
    isLoadingStats,
    isLoadingProgress,
    isLoadingCourses
  } = useStudyStore();
  
  const [greeting, setGreeting] = useState('');

  // 初始化数据
  useEffect(() => {
    fetchStats();
    fetchProgress();
    fetchCourses();
  }, [fetchStats, fetchProgress, fetchCourses]);

  // 设置问候语
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 6) {
      setGreeting('夜深了，注意休息');
    } else if (hour < 12) {
      setGreeting('早上好');
    } else if (hour < 18) {
      setGreeting('下午好');
    } else {
      setGreeting('晚上好');
    }
  }, []);

  // 计算学习统计
  const completedCourses = progress?.filter(p => p.status === 'completed').length || 0;
  const totalCourses = getTotalCourses();
  const completionRate = Math.round((completedCourses / totalCourses) * 100);
  const studyTimeMinutes = stats?.totalStudyTime || 0;
  const studyTimeHours = Math.round(studyTimeMinutes / 60 * 10) / 10;

  // 获取下一个推荐课程
  const getNextCourse = () => {
    if (!progress || progress.length === 0) return allCourses[0];
    
    // 按day排序找到第一个未完成的课程
    const sortedCourses = [...allCourses].sort((a, b) => a.day - b.day);
    
    for (const course of sortedCourses) {
      const courseProgress = progress.find(p => p.courseId === course.id);
      if (!courseProgress || courseProgress.status !== 'completed') {
        return course;
      }
    }
    return null; // 全部完成
  };

  const nextCourse = getNextCourse();

  // 最近的学习活动
  const recentActivities = progress
    ?.filter(p => p.status !== 'not_started')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5) || [];

  // 学习成就数据
  const achievementsCount = stats?.achievements?.length || 0;
  const currentStreak = stats?.streak || 0;

  if (isLoadingStats || isLoadingProgress || isLoadingCourses) {
    return <LoadingScreen message="正在加载学习数据..." variant="minimal" />;
  }

  return (
    <div className="space-y-6">
      {/* 欢迎区域 */}
      <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2 animate-slide-up">
                {greeting}，{user?.name}！
              </h1>
              <p className="text-primary-100 text-lg animate-slide-up delay-100">
                继续你的前端开发学习之旅
              </p>
            </div>
            
            <div className="hidden md:block animate-bounce-in delay-200">
              <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* 快速开始按钮 */}
          <div className="mt-6 flex flex-wrap gap-3 animate-slide-up delay-300">
            {nextCourse && (
              <button
                onClick={() => navigate(`/courses/${nextCourse.day}`)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M9 16v-2a2 2 0 012-2h2a2 2 0 012 2v2M12 8V6a2 2 0 00-2-2H8a2 2 0 00-2 2v2h8z" />
                </svg>
                <span>继续学习</span>
              </button>
            )}
            
            <button
              onClick={() => navigate('/courses')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>浏览课程</span>
            </button>

            <button
              onClick={() => navigate('/progress')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>学习进度</span>
            </button>

            <button
              onClick={() => navigate('/accomplishments')}
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              <span>我的成就</span>
            </button>
          </div>
        </div>
      </div>

      {/* 学习统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* 完成课程 */}
        <div className="card p-6 hover:shadow-lg transition-all duration-300 animate-slide-up delay-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">完成课程</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {completedCourses}<span className="text-lg text-gray-500">/{totalCourses}</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-success-100 dark:bg-success-900 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-success-600 dark:text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="progress-bar h-2">
              <div 
                className="progress-fill transition-all duration-1000 ease-out"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              完成率 {completionRate}%
            </p>
          </div>
        </div>

        {/* 学习时长 */}
        <div className="card p-6 hover:shadow-lg transition-all duration-300 animate-slide-up delay-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">学习时长</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {studyTimeMinutes}<span className="text-lg text-gray-500">min</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-warning-100 dark:bg-warning-900 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-warning-600 dark:text-warning-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            {studyTimeHours > 0 ? `约 ${studyTimeHours}小时` : '开始学习吧！'}
          </p>
        </div>

        {/* 连续天数 */}
        <div className="card p-6 hover:shadow-lg transition-all duration-300 animate-slide-up delay-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">连续天数</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentStreak}<span className="text-lg text-gray-500">天</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            {currentStreak >= 7 ? '保持得很好！' : '继续努力！'}
          </p>
        </div>

        {/* 获得成就 */}
        <div className="card p-6 hover:shadow-lg transition-all duration-300 animate-slide-up delay-400">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">获得成就</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {achievementsCount}<span className="text-lg text-gray-500">个</span>
              </p>
            </div>
            <div className="w-12 h-12 bg-secondary-100 dark:bg-secondary-900 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-secondary-600 dark:text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            <button
              onClick={() => navigate('/achievements')}
              className="text-secondary-600 dark:text-secondary-400 hover:underline"
            >
              查看全部
            </button>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 推荐课程 */}
        <div className="lg:col-span-2 card animate-slide-up delay-500">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">推荐课程</h3>
          </div>
          <div className="card-body">
            {nextCourse ? (
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 dark:from-primary-900/20 dark:to-secondary-900/20 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      第{nextCourse.day}天：{nextCourse.title}
                    </h4>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {nextCourse.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{nextCourse.estimatedTime}分钟</span>
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        nextCourse.difficulty === 'beginner' ? 'bg-success-100 dark:bg-success-900 text-success-700 dark:text-success-300' :
                        nextCourse.difficulty === 'intermediate' ? 'bg-warning-100 dark:bg-warning-900 text-warning-700 dark:text-warning-300' :
                        'bg-danger-100 dark:bg-danger-900 text-danger-700 dark:text-danger-300'
                      }`}>
                        {nextCourse.difficulty === 'beginner' ? '初级' :
                         nextCourse.difficulty === 'intermediate' ? '中级' : '高级'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">主要知识点：</p>
                  <div className="flex flex-wrap gap-2">
                    {nextCourse.topics.slice(0, 4).map((topic, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm border border-gray-200 dark:border-gray-600"
                      >
                        {topic}
                      </span>
                    ))}
                    {nextCourse.topics.length > 4 && (
                      <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-lg text-sm">
                        +{nextCourse.topics.length - 4}个
                      </span>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => navigate(`/courses/${nextCourse.day}`)}
                  className="btn-primary flex items-center space-x-2 group"
                >
                  <span>开始学习</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-success-100 dark:bg-success-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-success-600 dark:text-success-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  恭喜完成所有课程！
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  你已经完成了所有{totalCourses}节前端开发课程
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 最近活动 */}
        <div className="card animate-slide-up delay-600">
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">最近活动</h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {recentActivities.length > 0 ? (
                recentActivities.map((activity) => (
                  <div key={activity._id} className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                      activity.status === 'completed' 
                        ? 'bg-success-100 dark:bg-success-900 text-success-700 dark:text-success-300'
                        : 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                    }`}>
                      {activity.day}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        第{activity.day}天课程
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {activity.status === 'completed' ? '已完成' : '学习中'}
                      </p>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(activity.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    还没有学习活动
                  </p>
                  <button
                    onClick={() => navigate('/courses')}
                    className="text-primary-600 dark:text-primary-400 text-sm hover:underline mt-2"
                  >
                    开始第一个课程
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
