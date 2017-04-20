# JKEF API v1
家琨教育基金会（jkef）的api。

## 数据结构
### Acceptor（受赠者）
-参数
  - `_id`
  - `idCard` 证件
    - `type` 证件类型
    - `number` 证件号码
  - `name` 姓名/名称

### Record（受赠记录）

EduHistory 教育经历

CareerHistory 工作经历

## API

### Acceptors（受赠者）

#### 获取指定Acceptor的数据
`GET /acceptors/:id?token=TOKEN`

- 参数
  - id 指定Acceptor的Id
  - token
- 返回值

  ```javascript
  {
    ret: 0,
    data: { ... } // Acceptor 对象
  }
  ```

#### 搜索受赠者列表
`GET /acceptors/search/:text`

#### 根据受赠记录筛选受赠者
`GET /acceptors/filter-by-record?project=?&year=?&token=TOKEN`

根据id更新受赠者
`POST /acceptors/:id?token=`

body：

创建受赠者
`PUT /acceptors?token=`

删除受赠者
`DELETE /acceptors/:id?token=`

添加教育经历
`PUT /acceptors/:id/edu?token=`

删除教育经历
`DELETE /acceptors/:id/edu/:eduId?token=`

添加工作经历
`PUT /acceptors/:id/career?token=`

删除工作经历
`DELETE /acceptors/:id/career/:careerId?token=`

添加受赠记录
`PUT /acceptors/:id/record?token=`

删除受赠记录
`DELETE /acceptors/:id/record/:recordId?token=`
