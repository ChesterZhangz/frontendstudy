import React, { useEffect, useState, Suspense } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStudyStore } from '@/stores/studyStore';
import { allCourses, getCourseComponent } from '@/data/courses';

const CourseDetail: React.FC = () => {
  const { day } = useParams<{ day: string }>();
  const [CourseComponent, setCourseComponent] = useState<React.ComponentType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { 
    progress, 
    fetchProgress, 
    fetchStats,
    startLearning,
    completeLearning,
    checkAllTasksCompleted,
    error,
    clearError,
    currentProgress
  } = useStudyStore();

  const dayNumber = parseInt(day || '1', 10);
  const course = allCourses.find(c => c.day === dayNumber);

  useEffect(() => {
    fetchProgress();
    fetchStats();
  }, [fetchProgress, fetchStats]);

  useEffect(() => {
    const loadCourseComponent = async () => {
      if (!course) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const component = await getCourseComponent(course.id);
        setCourseComponent(() => component);
      } catch (error) {
        console.error('Failed to load course component:', error);
        setCourseComponent(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourseComponent();
  }, [course]);

  // 获取当前课程进度
  const courseProgress = progress.find(p => p.day === dayNumber);
  const courseStatus = courseProgress?.status || 'not_started';

  // 获取相邻课程
  const prevCourse = allCourses.find(c => c.day === dayNumber - 1);
  const nextCourse = allCourses.find(c => c.day === dayNumber + 1);

  // 开始学习
  const handleStartLearning = async () => {
    if (!course) return;
    
    try {
      clearError();
      await startLearning(course.id);
    } catch (error) {
      console.error('Failed to start learning:', error);
    }
  };

  // 完成课程
  const handleCompleteCourse = async () => {
    if (!course) return;
    
    try {
      clearError();
      await completeLearning(course.id);
    } catch (error) {
      console.error('Failed to complete course:', error);
    }
  };

  // 检查是否可以完成课程
  const canCompleteCourse = course ? checkAllTasksCompleted(course.id) : false;
  
  // 调试信息
  console.log('CourseDetail Debug:', {
    courseId: course?.id,
    dayNumber,
    canCompleteCourse,
    courseStatus
  });


  if (!course) {
    return (
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-lg">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            课程不存在
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            抱歉，您访问的课程不存在或已被移除。
          </p>
          <Link
            to="/courses"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200"
          >
            返回课程列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <p className="text-red-700 dark:text-red-300">{error}</p>
            <button
              onClick={clearError}
              className="ml-auto text-red-400 hover:text-red-600 dark:hover:text-red-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
      {/* 课程头部信息 */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                第{course.day}天
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                course.difficulty === 'beginner' ? 'bg-green-500/20 text-green-100' :
                course.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-100' :
                'bg-red-500/20 text-red-100'
              }`}>
                {course.difficulty === 'beginner' ? '入门' : 
                 course.difficulty === 'intermediate' ? '中级' : '高级'}
              </span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium capitalize">
                {course.category}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold mb-3">{course.title}</h1>
            <p className="text-blue-100 mb-4 text-lg">{course.description}</p>
            
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>预计 {course.estimatedTime} 分钟</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span>{course.topics.length} 个知识点</span>
              </div>
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <span className="capitalize">{courseStatus === 'completed' ? '已完成' : courseStatus === 'in_progress' ? '学习中' : '未开始'}</span>
              </div>
              {courseStatus === 'in_progress' && (currentProgress || courseProgress) && (
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>已学习 {(currentProgress || courseProgress)?.studyTime || 0} 分钟</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>

        {/* 知识点标签 */}
        <div className="mt-6">
          <h3 className="text-sm font-medium text-blue-100 mb-2">本节课程将学习：</h3>
          <div className="flex flex-wrap gap-2">
            {course.topics.map((topic, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-white/20 rounded-full text-sm"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 课程操作栏 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* 返回课程列表 */}
            <Link
              to="/courses"
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>返回课程</span>
            </Link>

            {/* 上一课 */}
            {prevCourse && (
              <Link
                to={`/courses/${prevCourse.day}`}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>上一课</span>
              </Link>
            )}

            {/* 下一课 */}
            {nextCourse && (
              <Link
                to={`/courses/${nextCourse.day}`}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
              >
                <span>下一课</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {courseStatus === 'not_started' && (
              <button
                onClick={handleStartLearning}
                className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10v4a2 2 0 002 2h2a2 2 0 002-2v-4M9 10V9a2 2 0 012-2h2a2 2 0 012 2v1" />
                </svg>
                <span>开始学习</span>
              </button>
            )}

            {courseStatus === 'in_progress' && (
              <button
                onClick={handleCompleteCourse}
                disabled={!canCompleteCourse}
                className={`px-6 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                  canCompleteCourse
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>{canCompleteCourse ? '完成课程' : '请完成所有任务'}</span>
              </button>
            )}

            {courseStatus === 'completed' && (
              <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>已完成</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 课程内容 */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">正在加载课程内容...</p>
          </div>
        ) : CourseComponent ? (
          <div className="p-6">
            {courseStatus === 'not_started' ? (
              <div className="p-12 text-center">
                <svg className="w-16 h-16 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10v4a2 2 0 002 2h2a2 2 0 002-2v-4M9 10V9a2 2 0 012-2h2a2 2 0 012 2v1" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  请点击开始学习
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  点击上方的"开始学习"按钮开始本节课程的学习
                </p>
                <button
                  onClick={handleStartLearning}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 flex items-center space-x-2 mx-auto"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.586a1 1 0 01.707.293l2.414 2.414a1 1 0 00.707.293H15M9 10v4a2 2 0 002 2h2a2 2 0 002-2v-4M9 10V9a2 2 0 012-2h2a2 2 0 012 2v1" />
                  </svg>
                  <span>开始学习</span>
                </button>
              </div>
            ) : (
              <Suspense fallback={
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">正在渲染课程内容...</p>
                </div>
              }>
                <CourseComponent />
              </Suspense>
            )}
          </div>
        ) : (
          <div className="p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              课程内容加载失败
            </h3>
        <p className="text-gray-600 dark:text-gray-400">
              抱歉，无法加载课程内容。请刷新页面重试。
        </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetail;
