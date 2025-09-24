import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStudyStore } from '@/stores/studyStore';
import { allCourses, getCoursesByCategory, getTotalCourses } from '@/data/courses';

const Courses: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'html' | 'css' | 'javascript'>('all');
  const { progress, stats, fetchProgress, fetchStats } = useStudyStore();

  useEffect(() => {
    fetchProgress();
    fetchStats();
  }, [fetchProgress, fetchStats]);

  // 获取过滤后的课程
  const filteredCourses = activeCategory === 'all' 
    ? allCourses 
    : getCoursesByCategory(activeCategory);

  // 获取课程完成状态
  const getCourseStatus = (day: number) => {
    const courseProgress = progress.find(p => p.day === day);
    return courseProgress?.status || 'not_started';
  };

  // 获取课程进度百分比
  const getCourseProgress = (day: number) => {
    const courseProgress = progress.find(p => p.day === day);
    if (courseProgress?.status === 'completed') return 100;
    if (courseProgress?.status === 'in_progress') return 50;
    return 0;
  };

  // 获取难度颜色
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-300';
      case 'intermediate':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'advanced':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  // 获取状态图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case 'in_progress':
        return (
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        );
    }
  };

  const totalCourses = getTotalCourses();
  const completedCount = stats?.completedDays || 0;
  const completionPercentage = Math.round((completedCount / totalCourses) * 100);

  return (
    <div className="space-y-6">
      {/* 学习概览卡片 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">课程学习</h2>
            <p className="text-blue-100 mb-4">
              系统化学习前端开发技术，从HTML基础到JavaScript进阶
            </p>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>{completedCount}/{totalCourses} 课程</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span>{completionPercentage}% 完成</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{Math.round((stats?.totalStudyTime || 0) / 60)}h 学习时长</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* 进度条 */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>整体进度</span>
            <span>{completionPercentage}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 课程分类筛选 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeCategory === 'all'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            全部课程 ({totalCourses})
          </button>
          <button
            onClick={() => setActiveCategory('html')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeCategory === 'html'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            HTML基础 ({getCoursesByCategory('html').length})
          </button>
          <button
            onClick={() => setActiveCategory('css')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeCategory === 'css'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            CSS样式 ({getCoursesByCategory('css').length})
          </button>
          <button
            onClick={() => setActiveCategory('javascript')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
              activeCategory === 'javascript'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            JavaScript ({getCoursesByCategory('javascript').length})
          </button>
        </div>

        {/* 课程网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const status = getCourseStatus(course.day);
            const progressPercent = getCourseProgress(course.day);
            
            return (
              <Link
                key={course.id}
                to={`/courses/${course.day}`}
                className="group block bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        第{course.day}天
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(course.difficulty)}`}>
                        {course.difficulty === 'beginner' ? '入门' : 
                         course.difficulty === 'intermediate' ? '中级' : '高级'}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                  {getStatusIcon(status)}
                </div>

                {/* 课程标签 */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {course.topics.slice(0, 3).map((topic, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md"
                    >
                      {topic}
                    </span>
                  ))}
                  {course.topics.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-md">
                      +{course.topics.length - 3}
                    </span>
                  )}
                </div>

                {/* 课程信息 */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{course.estimatedTime}分钟</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <span className="capitalize">{course.category}</span>
                  </div>
                </div>

                {/* 进度条 */}
                {status !== 'not_started' && (
                  <div className="mb-2">
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>进度</span>
                      <span>{progressPercent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* 开始学习按钮 */}
                <div className="mt-4">
                  <div className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center py-2 rounded-lg text-sm font-medium group-hover:shadow-lg transition-all duration-200">
                    {status === 'completed' ? '复习课程' : 
                     status === 'in_progress' ? '继续学习' : '开始学习'}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-gray-500 dark:text-gray-400">该分类下暂无课程</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;
