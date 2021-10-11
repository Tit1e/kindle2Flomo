# Send2Flomo

![](https://img.shields.io/badge/license-GPL-green.svg)
&nbsp;&nbsp;&nbsp;&nbsp;
[![](https://img.shields.io/badge/即刻-@直走的螃蟹-FFE440.svg)](https://web.okjike.com/u/FFDB1E46-63DC-43BE-AA1A-36F3D9CD0017)
### 将 Kindle 笔记一键导入至 flomo


[中文](./README.md) | [English](./README_en_US.md)

## 预览
![](./screenshot/edit.png)

![](./screenshot/help.png)

## 注册 [flomo](https://flomoapp.com/register2/?MTAzNDE)

## 在线访问地址：[Send2Flomo](https://tit1e.github.io/kindle2Flomo/)

## Mac 应用下载
* [蓝奏云](https://wwr.lanzoui.com/b02c3nkyf) 密码:47if（请下载最新版本）
* [releases](https://github.com/Tit1e/kindle2Flomo/releases)

## 问题反馈
![](https://personal-1251959693.cos.ap-chengdu.myqcloud.com/2021-08-09-kindle2flomo%E9%97%AE%E9%A2%98%E5%8F%8D%E9%A6%88.png)


## 开发注意事项
**bplistParser** 这个依赖需手动修改 `maxObjectSize` 与 `maxObjectCount` 这两个常量的数值，修改得大一些，否则当 `Books.plist` 中图书数量过多时会出现无法解析的问题。