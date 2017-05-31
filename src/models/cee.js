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

}
*/

const EntityManager = require('./entity-manager').default;

export default class CeeInfoManager extends EntityManager {
  constructor(mongUrl, collectionName = 'cee_info') {
    super(mongUrl, collectionName);
  }
  list(limit = 200, skip = 0) {
    return this.find({
      limit,
      skip,
    });
  }
}
