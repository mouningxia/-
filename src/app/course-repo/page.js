'use client';

import React from 'react';

export default function CourseRepoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-12">这是MMer的前端开发技术课程仓库</h1>
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">蜜雪冰城产品搜索</h2>
          <form action="https://www.mixue.com/search" method="GET" className="flex gap-4 mb-4">
            <input 
              type="text" 
              name="q" 
              placeholder="请输入饮品名称"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <input 
              type="submit" 
              value="立即查找"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            />
          </form>
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-700 mb-2">我的作业在哪里？</h3>
            <ol className="list-decimal pl-5 space-y-1 text-gray-600">
              <li>床前明月光</li>
              <li>疑似地上霜</li>
              <li>举头望明月</li>
              <li>低头思故乡</li>
            </ol>
          </div>
          <div>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>春天在哪里啊 春天在哪里</li>
              <li>春天在那青翠的山林里</li>
              <li>这里有红花啊 这里有绿草 还有那会唱歌的小黄鹂</li>
            </ul>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">图片展示</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="aspect-square relative">
              <img 
                src="https://q5.itc.cn/q_70/images01/20241212/476694d885cb4d1bbe0716eed286a03a.jpeg" 
                alt="春天樱花"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <div className="mb-6 aspect-video">
                <iframe
                  src="https://player.bilibili.com/player.html?isOutside=true&aid=114018916245303&bvid=BV1FNwoe9EEM&cid=28439677673&p=1"
                  className="w-full h-full rounded-lg shadow-sm"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="aspect-square relative">
                <img 
                  src="https://q5.itc.cn/q_70/images01/20241212/476694d885cb4d1bbe0716eed286a03a.jpeg" 
                  alt="小猫咪"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">杨老师你好</h2>
          <p className="text-gray-600 mb-4">
            熊猫界的顶流女明星
            <a 
              href="https://q5.itc.cn/q_70/images01/20241212/476694d885cb4d1bbe0716eed286a03a.jpeg"
              className="text-blue-600 hover:text-blue-800 hover:underline"
            >
              花花
            </a>
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">郑风▪野有蔓草</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 text-gray-600">野有蔓草，零露薄兮。</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-600">有美一人，清扬婉兮。</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-600">邂逅相遇，适我愿兮。</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 px-4 py-3 text-gray-600">野有蔓草，零露瀼瀼。</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-600">有美一人，婉如清扬。</td>
                  <td className="border border-gray-300 px-4 py-3 text-gray-600">邂逅相遇，与子偕臧。</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}