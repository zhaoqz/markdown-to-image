'use client';
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';

// 主题列表
const themes = [
  { id: 'blue', name: '蓝色渐变', className: 'bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-500' },
  { id: 'pink', name: '粉色渐变', className: 'bg-gradient-to-br from-pink-600/80 via-red-400/80 to-pink-600/60' },
  { id: 'purple', name: '紫色渐变', className: 'bg-gradient-to-r from-purple-600 to-purple-700' },
  { id: 'green', name: '绿色渐变', className: 'bg-gradient-to-br from-green-600/80 to-green-800/80' },
  { id: 'yellow', name: '黄色渐变', className: 'bg-gradient-to-br from-yellow-500 via-orange-300 to-yellow-500' },
  { id: 'gray', name: '灰色渐变', className: 'bg-gradient-to-br from-black/90 via-gray-700 to-black/90' },
  { id: 'red', name: '红色渐变', className: 'bg-gradient-to-r from-red-500 to-orange-500' },
  { id: 'indigo', name: '靛蓝渐变', className: 'bg-gradient-to-br from-indigo-700 via-blue-600/80 to-indigo-700' },
  { id: 'SpringGradientWave', name: '春日波浪', className: 'bg-spring-gradient-wave bg-cover' },
];

// 字体大小选项
const fontSizes = [
  { id: 'sm', name: '小', icon: 'text-sm' },
  { id: 'base', name: '中', icon: 'text-base' },
  { id: 'lg', name: '大', icon: 'text-lg' },
  { id: 'xl', name: '特大', icon: 'text-xl' },
];

// 排版主题
const typographyThemes = [
  { id: 'base', name: '基础' },
  { id: 'classic', name: '经典' },
  { id: 'vibrant', name: '活力' },
];

interface PosterSettingsProps {
  title: string;
  setTitle: (title: string) => void;
  author: string;
  setAuthor: (author: string) => void;
  showDate: boolean;
  setShowDate: (showDate: boolean) => void;
  brandInfo: string;
  setBrandInfo: (brandInfo: string) => void;
  copyright: string;
  setCopyright: (copyright: string) => void;
  theme: string;
  setTheme: (theme: string) => void;
  typographyTheme?: string;
  setTypographyTheme?: (theme: string) => void;
  fontSize?: string;
  setFontSize?: (size: string) => void;
  padding?: number;
  setPadding?: (padding: number) => void;
}

const PosterSettings: React.FC<PosterSettingsProps> = ({
  title,
  setTitle,
  author,
  setAuthor,
  showDate,
  setShowDate,
  brandInfo,
  setBrandInfo,
  copyright,
  setCopyright,
  theme,
  setTheme,
  typographyTheme = 'base',
  setTypographyTheme = () => {},
  fontSize = 'base',
  setFontSize = () => {},
  padding = 6,
  setPadding = () => {},
}) => {

  return (
    <div className="w-full h-full flex flex-col p-6 space-y-6 bg-white rounded-lg">
      <h2 className="text-xl font-semibold">自定义海报</h2>
      <p className="text-sm text-gray-500">自定义背景、主题和字体大小，让您的海报更具个性。</p>
      
      {/* 固定要素设置 */}
      <div className="space-y-5">
        <div className="space-y-3">
          <Label htmlFor="title" className="text-base font-medium">标题</Label>
          <Input 
            id="title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            placeholder="输入海报标题"
            className="h-10"
          />
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="author" className="text-base font-medium">作者</Label>
          <Input 
            id="author" 
            value={author} 
            onChange={(e) => setAuthor(e.target.value)} 
            placeholder="输入作者名称"
            className="h-10"
          />
        </div>
        
        <div className="flex items-center space-x-3 py-2">
          <Switch 
            id="show-date" 
            checked={showDate}
            onCheckedChange={setShowDate}
          />
          <Label htmlFor="show-date" className="text-base font-medium">显示日期</Label>
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="brand-info" className="text-base font-medium">品牌信息</Label>
          <Input 
            id="brand-info" 
            value={brandInfo} 
            onChange={(e) => setBrandInfo(e.target.value)} 
            placeholder="输入品牌信息"
            className="h-10"
          />
        </div>
        
        <div className="space-y-3">
          <Label htmlFor="copyright" className="text-base font-medium">版权声明</Label>
          <Input 
            id="copyright" 
            value={copyright} 
            onChange={(e) => setCopyright(e.target.value)} 
            placeholder="输入版权声明"
            className="h-10"
          />
        </div>
      </div>
      
      {/* 背景选择 */}
      <div className="space-y-4">
        <Label className="text-base font-medium">背景</Label>
        <div className="grid grid-cols-4 gap-2">
          {themes.map((themeOption) => (
            <Button
              key={themeOption.id}
              type="button"
              variant={theme === themeOption.id ? "default" : "outline"}
              className={`w-12 h-12 p-0 ${themeOption.className} ${theme === themeOption.id ? 'ring-2 ring-yellow-500' : ''}`}
              onClick={() => setTheme(themeOption.id)}
            />
          ))}
        </div>
      </div>
      
      {/* 排版主题 */}
      <div className="space-y-4">
        <Label className="text-base font-medium">排版主题</Label>
        <div className="flex gap-2">
          {typographyThemes.map((item) => (
            <Button
              key={item.id}
              variant={typographyTheme === item.id ? "default" : "outline"}
              className="flex-1"
              onClick={() => setTypographyTheme(item.id)}
            >
              {item.name}
            </Button>
          ))}
        </div>
      </div>
      
      {/* 字体大小 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium">字体大小</Label>
          <div className="flex gap-1">
            {fontSizes.map((size) => (
              <Button
                key={size.id}
                variant={fontSize === size.id ? "default" : "outline"}
                className="w-10 h-10"
                onClick={() => setFontSize(size.id)}
              >
                <span className={size.icon}>T</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {/* 内边距 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label className="text-base font-medium flex items-center gap-2">
            内边距
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
              {padding}
            </span>
          </Label>
          <div className="w-1/2 relative">
            <input
              type="range"
              min="0"
              max="8"
              value={padding}
              onChange={(e) => setPadding(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterSettings;
