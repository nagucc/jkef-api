/*
CeeInfo
中高考录取情况

数据结构：
{
    _id,    // 由MongoDB数据系统自动生成的Id
    name,   // 考生姓名
    parentName, // 家长姓名
    homeAddress,    // 家庭住址
    phone,  // 联系电话
    fromSchool, // 毕业学校
    toSchool,   // 录取学校
    point,      // 考试分数
    examType,   // 考试类型
    user,       // 关联的用户信息

}
*/

const EntityManager = require('./entity-manager').default;

export default class CeeInfoManager extends EntityManager {
  constructor(mongUrl, collectionName = 'cee_info') {
    super(mongUrl, collectionName);
  }
  list(options = {}) {
    options = {
      pageSize: 200,
      pageIndex: 0,
      ...options,
    };
    return this.find({
      limit: options.pageSize,
      skip: options.pageSize * options.pageIndex,
    });
  }
  findByUser(appId, userId) {
    return this.findOne({
      user: {
        [appId]: userId,
      },
    });
  }
}
