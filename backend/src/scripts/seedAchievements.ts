import mongoose from 'mongoose';
import { connectDatabase } from '../config/database';
import { Achievement } from '../models/Achievement';

// 成就数据
const achievements = [
  // 学习类成就
  {
    name: '初学者',
    description: '完成第一个课程',
    icon: '🎓',
    category: 'learning',
    rarity: 'common',
    requirements: {
      type: 'courses_completed',
      value: 1,
      description: '完成 1 个课程'
    },
    rewards: {
      points: 100,
      badge: 'beginner',
      title: '初学者'
    }
  },
  {
    name: '学习新手',
    description: '完成5个课程',
    icon: '📚',
    category: 'learning',
    rarity: 'common',
    requirements: {
      type: 'courses_completed',
      value: 5,
      description: '完成 5 个课程'
    },
    rewards: {
      points: 500,
      badge: 'student',
      title: '学习新手'
    }
  },
  {
    name: '学习达人',
    description: '完成10个课程',
    icon: '🏆',
    category: 'learning',
    rarity: 'rare',
    requirements: {
      type: 'courses_completed',
      value: 10,
      description: '完成 10 个课程'
    },
    rewards: {
      points: 1000,
      badge: 'scholar',
      title: '学习达人'
    }
  },
  {
    name: 'JavaScript大师',
    description: '完成所有20个课程',
    icon: '👑',
    category: 'learning',
    rarity: 'legendary',
    requirements: {
      type: 'courses_completed',
      value: 20,
      description: '完成所有 20 个课程'
    },
    rewards: {
      points: 5000,
      badge: 'master',
      title: 'JavaScript大师',
      unlockFeature: 'advanced_courses'
    }
  },

  // 时间类成就
  {
    name: '时间投入者',
    description: '累计学习1小时',
    icon: '⏰',
    category: 'milestone',
    rarity: 'common',
    requirements: {
      type: 'study_time',
      value: 60,
      description: '累计学习 60 分钟'
    },
    rewards: {
      points: 200,
      badge: 'time_investor'
    }
  },
  {
    name: '时间管理大师',
    description: '累计学习10小时',
    icon: '⏳',
    category: 'milestone',
    rarity: 'rare',
    requirements: {
      type: 'study_time',
      value: 600,
      description: '累计学习 600 分钟'
    },
    rewards: {
      points: 2000,
      badge: 'time_master',
      title: '时间管理大师'
    }
  },
  {
    name: '学习狂人',
    description: '累计学习50小时',
    icon: '🔥',
    category: 'milestone',
    rarity: 'epic',
    requirements: {
      type: 'study_time',
      value: 3000,
      description: '累计学习 3000 分钟'
    },
    rewards: {
      points: 10000,
      badge: 'study_fanatic',
      title: '学习狂人'
    }
  },

  // 连续学习成就
  {
    name: '坚持不懈',
    description: '连续学习3天',
    icon: '💪',
    category: 'streak',
    rarity: 'common',
    requirements: {
      type: 'streak_days',
      value: 3,
      description: '连续学习 3 天'
    },
    rewards: {
      points: 300,
      badge: 'persistent'
    }
  },
  {
    name: '学习习惯',
    description: '连续学习7天',
    icon: '📅',
    category: 'streak',
    rarity: 'rare',
    requirements: {
      type: 'streak_days',
      value: 7,
      description: '连续学习 7 天'
    },
    rewards: {
      points: 1000,
      badge: 'habit_former',
      title: '学习习惯'
    }
  },
  {
    name: '学习机器',
    description: '连续学习30天',
    icon: '🤖',
    category: 'streak',
    rarity: 'legendary',
    requirements: {
      type: 'streak_days',
      value: 30,
      description: '连续学习 30 天'
    },
    rewards: {
      points: 5000,
      badge: 'learning_machine',
      title: '学习机器'
    }
  },

  // 编程类成就
  {
    name: '代码新手',
    description: '提交10次代码',
    icon: '💻',
    category: 'coding',
    rarity: 'common',
    requirements: {
      type: 'code_submissions',
      value: 10,
      description: '提交 10 次代码'
    },
    rewards: {
      points: 200,
      badge: 'code_novice'
    }
  },
  {
    name: '代码实践者',
    description: '提交50次代码',
    icon: '⌨️',
    category: 'coding',
    rarity: 'rare',
    requirements: {
      type: 'code_submissions',
      value: 50,
      description: '提交 50 次代码'
    },
    rewards: {
      points: 1000,
      badge: 'code_practitioner',
      title: '代码实践者'
    }
  },
  {
    name: '代码大师',
    description: '提交200次代码',
    icon: '🚀',
    category: 'coding',
    rarity: 'epic',
    requirements: {
      type: 'code_submissions',
      value: 200,
      description: '提交 200 次代码'
    },
    rewards: {
      points: 5000,
      badge: 'code_master',
      title: '代码大师'
    }
  },

  // 特殊成就
  {
    name: '完美主义者',
    description: '所有练习都获得满分',
    icon: '⭐',
    category: 'special',
    rarity: 'epic',
    requirements: {
      type: 'perfect_scores',
      value: 20,
      description: '获得 20 个完美分数'
    },
    rewards: {
      points: 3000,
      badge: 'perfectionist',
      title: '完美主义者'
    }
  },
  {
    name: '助人为乐',
    description: '帮助其他学习者',
    icon: '🤝',
    category: 'special',
    rarity: 'rare',
    requirements: {
      type: 'help_others',
      value: 5,
      description: '帮助 5 个其他学习者'
    },
    rewards: {
      points: 1500,
      badge: 'helper',
      title: '助人为乐'
    }
  }
];

// 插入成就数据
const seedAchievements = async () => {
  try {
    await connectDatabase();
    
    // 清空现有成就数据
    await Achievement.deleteMany({});
    console.log('✅ 清空现有成就数据');
    
    // 插入成就数据
    await Achievement.insertMany(achievements);
    console.log('✅ 插入成就数据成功');
    
    console.log('🎉 成就数据初始化完成！');
    process.exit(0);
  } catch (error) {
    console.error('❌ 成就数据初始化失败:', error);
    process.exit(1);
  }
};

// 运行数据初始化
seedAchievements();
