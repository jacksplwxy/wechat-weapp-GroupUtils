/*
·XMAPP启动mysql和apache服务器
·打开cmd再进入mysql的bin目录:cd C:\xampp\mysql\bin
·进入mysql:mysql -uroot -p 回车
·提示输出密码，直接回车
·导入自定义sql文件:source C:/xampp/htdocs/application/groupUtils.sql（注意斜杠方向）
*/
set names utf8;
drop database if exists tongxuequn;
create database tongxuequn charset=utf8;
use tongxuequn;

CREATE TABLE wxuser(
  id INT PRIMARY KEY AUTO_INCREMENT,
  openid VARCHAR(32),
  AppID VARCHAR(32),
  arcID VARCHAR(32),
  avatarUrl VARCHAR(128),
  city VARCHAR(32),
  language VARCHAR(32),
  nickName VARCHAR(32),
  province VARCHAR(32),
  telNumber VARCHAR(32),
  uName VARCHAR(32),
  time VARCHAR(32),
  joinerName VARCHAR(32),
  joinerTel VARCHAR(32),
  joinerRemark VARCHAR(512)
);

CREATE TABLE task(
  id INT PRIMARY KEY AUTO_INCREMENT,
  openid VARCHAR(32),
  taskid VARCHAR(32),
  title VARCHAR(128),
  date VARCHAR(32),
  time VARCHAR(32),
  address VARCHAR(128),
  name VARCHAR(32),
  tel VARCHAR(32),
  remark VARCHAR(512)
);

CREATE TABLE user(
  id INT PRIMARY KEY AUTO_INCREMENT,
  taskid VARCHAR(32),
  userid VARCHAR(32),
  viewerid VARCHAR(32)
);

CREATE TABLE chatgroup(
  id INT PRIMARY KEY AUTO_INCREMENT,
  groupid VARCHAR(32),
  taskid VARCHAR(32)
);

CREATE TABLE vote_task(
  id INT PRIMARY KEY AUTO_INCREMENT,
  openid VARCHAR(32),
  voteid VARCHAR(32),
  title VARCHAR(128),
  description VARCHAR(256),
  optionData text,
  date VARCHAR(16),
  time VARCHAR(16),
  noName VARCHAR(8),
  radio INT
);

CREATE TABLE vote_user(
  id INT PRIMARY KEY AUTO_INCREMENT,
  voteid VARCHAR(32),
  userid VARCHAR(32)
);

CREATE TABLE vote_chatgroup(
  id INT PRIMARY KEY AUTO_INCREMENT,
  groupid VARCHAR(32),
  voteid VARCHAR(32)
);

CREATE TABLE phoneBook_user(
  id INT PRIMARY KEY AUTO_INCREMENT,
  openid VARCHAR(32),
  name VARCHAR(32),
  tel VARCHAR(32),
  address VARCHAR(128),
  remark text,
  gId VARCHAR(32)
);

CREATE TABLE notice_task(
  id INT PRIMARY KEY AUTO_INCREMENT,
  openid VARCHAR(32),
  noticeid VARCHAR(32),
  date VARCHAR(16),
  fileNumber VARCHAR(16),
  title VARCHAR(128),
  description text,
  name VARCHAR(16)
);

CREATE TABLE notice_user(
  id INT PRIMARY KEY AUTO_INCREMENT,
  noticeid VARCHAR(32),
  userid VARCHAR(32)
);

CREATE TABLE notice_chatgroup(
  id INT PRIMARY KEY AUTO_INCREMENT,
  groupid VARCHAR(32),
  noticeid VARCHAR(32)
);