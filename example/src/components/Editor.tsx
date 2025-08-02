'use client';
import React, { useState, ChangeEvent, TextareaHTMLAttributes, useRef, useEffect } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from './ui/button'
import { Md2PosterContent, Md2Poster, Md2PosterHeader, Md2PosterFooter } from 'markdown-to-image'
import { Copy, LoaderCircle, Download } from 'lucide-react';
import PosterSettings from './PosterSettings';
import '@/styles/themes.css';

const Textarea: React.FC<TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ onChange, ...rest }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // 保存历史记录
  const saveToHistory = (value: string) => {
    const newHistory = [...history.slice(0, historyIndex + 1), value];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isCtrlOrCmd = e.ctrlKey || e.metaKey;
    
    // 全选 Ctrl+A / Cmd+A
    if (isCtrlOrCmd && e.key === 'a') {
      e.currentTarget.select();
      e.preventDefault();
      return;
    }
    
    // 撤销 Ctrl+Z / Cmd+Z
    if (isCtrlOrCmd && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      if (historyIndex > 0) {
        const prevValue = history[historyIndex - 1];
        setHistoryIndex(historyIndex - 1);
        e.currentTarget.value = prevValue;
        onChange?.({ target: e.currentTarget } as any);
      }
      return;
    }
    
    // 重做 Ctrl+Y / Cmd+Shift+Z
    if ((isCtrlOrCmd && e.key === 'y') || (isCtrlOrCmd && e.shiftKey && e.key === 'z')) {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const nextValue = history[historyIndex + 1];
        setHistoryIndex(historyIndex + 1);
        e.currentTarget.value = nextValue;
        onChange?.({ target: e.currentTarget } as any);
      }
      return;
    }
    
    // 复制 Ctrl+C / Cmd+C (浏览器默认行为)
    // 粘贴 Ctrl+V / Cmd+V (浏览器默认行为)
    // 剪切 Ctrl+X / Cmd+X (浏览器默认行为)
    
    // Tab 键插入缩进
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;
      
      if (e.shiftKey) {
        // Shift+Tab 减少缩进
        const lineStart = value.lastIndexOf('\n', start - 1) + 1;
        const lineText = value.substring(lineStart, start);
        if (lineText.startsWith('  ')) {
          const newValue = value.substring(0, lineStart) + lineText.substring(2) + value.substring(start);
          textarea.value = newValue;
          textarea.setSelectionRange(start - 2, end - 2);
          onChange?.({ target: textarea } as any);
        }
      } else {
        // Tab 增加缩进
        const newValue = value.substring(0, start) + '  ' + value.substring(end);
        textarea.value = newValue;
        textarea.setSelectionRange(start + 2, start + 2);
        onChange?.({ target: textarea } as any);
      }
      return;
    }
    
    // Enter 键自动缩进
    if (e.key === 'Enter') {
      const textarea = e.currentTarget;
      const start = textarea.selectionStart;
      const value = textarea.value;
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const lineText = value.substring(lineStart, start);
      const indent = lineText.match(/^(\s*)/)?.[1] || '';
      
      // 如果当前行是列表项，自动添加列表符号
      const listMatch = lineText.match(/^(\s*)([-*+]|\d+\.)\s/);
      if (listMatch) {
        e.preventDefault();
        const newValue = value.substring(0, start) + '\n' + indent + listMatch[2] + ' ' + value.substring(start);
        textarea.value = newValue;
        textarea.setSelectionRange(start + indent.length + listMatch[2].length + 2, start + indent.length + listMatch[2].length + 2);
        onChange?.({ target: textarea } as any);
        return;
      }
      
      // 普通自动缩进
      if (indent) {
        e.preventDefault();
        const newValue = value.substring(0, start) + '\n' + indent + value.substring(start);
        textarea.value = newValue;
        textarea.setSelectionRange(start + indent.length + 1, start + indent.length + 1);
        onChange?.({ target: textarea } as any);
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e);
    // 保存到历史记录（防抖）
    const value = e.target.value;
    setTimeout(() => {
      if (textareaRef.current?.value === value) {
        saveToHistory(value);
      }
    }, 1000);
  };

  return (
    <textarea
      ref={textareaRef}
      className="border-none bg-gray-100 p-8 w-full resize-none h-full min-h-screen
      focus-visible:outline-none focus-visible:ring-0 focus-visible:border-0
      text-gray-900/70 hover:text-gray-900 focus:text-gray-900 font-light font-inter
      "
      {...rest}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      placeholder="在此输入 Markdown 内容...

支持的快捷键：
• Ctrl/Cmd + A: 全选
• Ctrl/Cmd + Z: 撤销
• Ctrl/Cmd + Y: 重做
• Ctrl/Cmd + C/V/X: 复制/粘贴/剪切
• Tab: 增加缩进
• Shift + Tab: 减少缩进
• Enter: 自动缩进和列表续行"
    />
  )
}

const defaultMd = `# AI Morning News - April 29th
![image](https://imageio.forbes.com/specials-images/imageserve/64b5825a5b9b4d3225e9bd15/artificial-intelligence--ai/960x0.jpg?format=jpg&width=1440)
1. **MetaElephant Company Releases Multi-Modal Large Model XVERSE-V**: Supports image input of any aspect ratio, performs well in multiple authoritative evaluations, and has been open-sourced.
2. **Tongyi Qianwen Team Open-Sources Billion-Parameter Model Qwen1.5-110B**: Uses Transformer decoder architecture, supports multiple languages, and has an efficient attention mechanism.
3. **Shengshu Technology and Tsinghua University Release Video Large Model Vidu**: Adopts a fusion architecture of Diffusion and Transformer, generates high-definition videos with one click, leading internationally.
4. **Mutable AI Launches Auto Wiki v2**: Automatically converts code into Wikipedia-style articles, solving the problem of code documentation.
5. **Google Builds New Data Center in the U.S.**: Plans to invest $3 billion to build a data center campus in Indiana, expand facilities in Virginia, and launch an artificial intelligence opportunity fund.
6. **China Academy of Information and Communications Technology Releases Automobile Large Model Standard**: Aims to standardize and promote the intelligent development of the automotive industry.
7. Kimi Chat Mobile App Update: Version 1.2.1 completely revamps the user interface, introduces a new light mode, and provides a comfortable and intuitive experience.
  `

export default function Editor() {
  const [mdString, setMdString] = useState(defaultMd)
  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMdString(e.target.value)
  }
  const markdownRef = useRef<any>(null)
  const [copyLoading, setCopyLoading] = useState(false)
  const [downloadLoading, setDownloadLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)
  
  // 海报固定要素状态
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [showDate, setShowDate] = useState(false)
  const [brandInfo, setBrandInfo] = useState('')
  const [copyright, setCopyright] = useState('')
  const [theme, setTheme] = useState('SpringGradientWave')
  const [typographyTheme, setTypographyTheme] = useState('base') // 'base', 'classic', 'vibrant'
  const [fontSize, setFontSize] = useState('base') // 'sm', 'base', 'lg', 'xl'
  const [padding, setPadding] = useState(6) // 0-8
  
  // 使用 useEffect 确保只在客户端执行并加载配置
  useEffect(() => {
    setIsClient(true)
    loadConfiguration()
  }, [])

  // 保存配置到本地存储
  const saveConfiguration = () => {
    const config = {
      title,
      author,
      showDate,
      brandInfo,
      copyright,
      theme,
      typographyTheme,
      fontSize,
      padding,
      mdString
    }
    localStorage.setItem('markdown-to-image-config', JSON.stringify(config))
  }

  // 从本地存储加载配置
  const loadConfiguration = () => {
    try {
      const savedConfig = localStorage.getItem('markdown-to-image-config')
      if (savedConfig) {
        const config = JSON.parse(savedConfig)
        setTitle(config.title || '')
        setAuthor(config.author || '')
        setShowDate(config.showDate || false)
        setBrandInfo(config.brandInfo || '')
        setCopyright(config.copyright || '')
        setTheme(config.theme || 'SpringGradientWave')
        setTypographyTheme(config.typographyTheme || 'base')
        setFontSize(config.fontSize || 'base')
        setPadding(config.padding || 6)
        if (config.mdString) {
          setMdString(config.mdString)
        }
      }
    } catch (error) {
      console.error('加载配置失败:', error)
    }
  }

  // 监听配置变化并自动保存
  useEffect(() => {
    if (isClient) {
      saveConfiguration()
    }
  }, [title, author, showDate, brandInfo, copyright, theme, typographyTheme, fontSize, padding, mdString, isClient])
  
  // 复制到剪贴板功能
  const handleCopyToClipboard = () => {
    setCopyLoading(true)
    try {
      if (typeof navigator !== 'undefined' && !navigator.clipboard) {
        alert('复制功能在当前浏览器中不可用，请尝试下载功能。')
        setCopyLoading(false)
        return
      }
      
      if (!markdownRef.current) {
        setCopyLoading(false)
        alert('无法获取海报引用，请稍后再试。')
        return
      }
      
      markdownRef.current.handleCopy().then(res => {
        setCopyLoading(false)
        alert('复制成功！')
      }).catch(err => {
        setCopyLoading(false)
        console.error('复制出错:', err)
        alert('复制失败，请尝试使用下载功能。')
      })
    } catch (error) {
      setCopyLoading(false)
      console.error('复制过程中发生错误:', error)
      alert('复制过程中发生错误，请尝试使用下载功能。')
    }
  }
  
  // 下载图片功能
  const handleDownloadImage = async () => {
    setDownloadLoading(true)
    try {
      if (!markdownRef.current) {
        setDownloadLoading(false)
        alert('无法获取海报引用，请稍后再试。')
        return
      }
      
      // 尝试获取图片数据
      const posterElement = markdownRef.current.getPosterElement();
      if (!posterElement) {
        setDownloadLoading(false)
        alert('无法获取海报元素。')
        return
      }
      
      // 使用 html-to-image 或类似库生成图片
      import('modern-screenshot').then(async (module) => {
        try {
          const dataUrl = await module.toJpeg(posterElement);
          
          // 创建下载链接
          const link = document.createElement('a');
          link.download = '海报.jpg';
          link.href = dataUrl;
          link.click();
          
          setDownloadLoading(false);
          alert('海报已保存！');
        } catch (err) {
          console.error('生成图片失败:', err);
          setDownloadLoading(false);
          alert('生成图片失败，请稍后再试。');
        }
      }).catch(err => {
        console.error('加载图片处理模块失败:', err);
        setDownloadLoading(false);
        alert('无法加载图片处理模块，请稍后再试。');
      });
    } catch (error) {
      setDownloadLoading(false);
      console.error('处理图片时发生错误:', error);
      alert('处理图片时发生错误，请稍后再试。');
    }
  }
  
  const copySuccessCallback = () => {
    console.log('copySuccessCallback');
  }
  
  // 只在客户端渲染时显示完整内容
  if (!isClient) {
    return <div>加载中...</div>;
  }

  // 生成海报头部内容
  const renderPosterHeader = () => {
    const headerContent = [];
    
    // 始终显示标题
    headerContent.push(<span key="title" className="text-center w-full font-bold text-lg">{title}</span>);
    
    // 如果有作者或日期，则在下方显示
    const secondRow = [];
    if (author) {
      secondRow.push(<span key="author">{author}</span>);
    }
    
    if (showDate) {
      secondRow.push(<span key="date">{new Date().toLocaleDateString()}</span>);
    }
    
    return (
      <Md2PosterHeader className="flex flex-col justify-center items-center px-4 py-2 gap-2">
        {headerContent}
        {secondRow.length > 0 && (
          <div className="flex justify-between items-center w-full">
            {secondRow}
          </div>
        )}
      </Md2PosterHeader>
    );
  };

  // 生成海报底部内容
  const renderPosterFooter = () => {
    return (
      <Md2PosterFooter className='text-center'>
        <div className="flex items-center justify-center">
          <img src="/logo.png" alt="logo" className='inline-block mr-2 w-5' />
          {brandInfo}
        </div>
        {copyright && <div className="text-sm mt-1">{copyright}</div>}
      </Md2PosterFooter>
    );
  };

  return (
    <ScrollArea className="h-[96vh] w-full border-2 border-gray-900 rounded-xl my-4 relative">
      <div className="flex flex-row h-full">
        <div className="w-[30%]">
          {/* 编辑区 */}
          <Textarea placeholder="markdown" onChange={handleChange} defaultValue={mdString} />
        </div>
        <div className="w-[40%] mx-auto flex justify-center p-4">
          {/* 预览区 */}
          <div className="flex flex-col w-fit relative">
            {isClient && (
              <>
                <div className={`poster-padding-${padding}`}>
                  <Md2Poster theme={theme as any} copySuccessCallback={copySuccessCallback} ref={markdownRef}>
                    {renderPosterHeader()}
                    <Md2PosterContent className={`theme-${typographyTheme} font-size-${fontSize}`}>{mdString}</Md2PosterContent>
                    {renderPosterFooter()}
                  </Md2Poster>
                </div>
                
                {/* 按钮放在海报上方 */}
                <div className="absolute top-2 right-2 flex flex-row gap-2 opacity-80 hover:opacity-100 transition-all">
                  <Button className="rounded-xl" onClick={handleCopyToClipboard} {...copyLoading ? { disabled: true } : {}}>
                    {copyLoading ?
                      <LoaderCircle className="w-4 h-4 animate-spin" />
                      : <Copy className="w-4 h-4" />}
                    复制
                  </Button>
                  <Button className="rounded-xl" onClick={handleDownloadImage} {...downloadLoading ? { disabled: true } : {}}>
                    {downloadLoading ?
                      <LoaderCircle className="w-4 h-4 animate-spin" />
                      : <Download className="w-4 h-4" />}
                    下载
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="w-[30%] border-l border-gray-200">
          {/* 设置区 */}
          <PosterSettings 
            title={title}
            setTitle={setTitle}
            author={author}
            setAuthor={setAuthor}
            showDate={showDate}
            setShowDate={setShowDate}
            brandInfo={brandInfo}
            setBrandInfo={setBrandInfo}
            copyright={copyright}
            setCopyright={setCopyright}
            theme={theme}
            setTheme={setTheme}
            typographyTheme={typographyTheme}
            setTypographyTheme={setTypographyTheme}
            fontSize={fontSize}
            setFontSize={setFontSize}
            padding={padding}
            setPadding={setPadding}
          />
        </div>
      </div>
      {/* 按钮移到预览区内部 */}
    </ScrollArea>
  )
}