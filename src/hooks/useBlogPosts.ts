import { useState, useEffect, useCallback, useRef } from 'react'
import { MOCK_BLOG_POSTS, type IBlogPost } from '@/data/blog'

const STORAGE_KEY = '__auto_parts_blog_posts_v2'

// 数据迁移：确保每篇文章都有完整的必要字段，防止旧数据导致崩溃
function migratePost(p: unknown, index: number): IBlogPost {
  const post = p as Partial<IBlogPost>
  const fallbackTitle = `文章 ${index + 1}`
  const fallbackSummary = '暂无摘要'
  const fallbackContent = '暂无内容'

  return {
    id: post.id || `blog-migrated-${Date.now()}-${index}`,
    title: {
      zh: post.title?.zh || fallbackTitle,
      en: post.title?.en || fallbackTitle,
    },
    category: post.category || 'industry',
    coverImage: post.coverImage || '',
    author: post.author || 'Admin',
    summary: {
      zh: post.summary?.zh || fallbackSummary,
      en: post.summary?.en || fallbackSummary,
    },
    content: {
      zh: post.content?.zh || fallbackContent,
      en: post.content?.en || fallbackContent,
    },
    videoUrl: post.videoUrl || undefined,
    videoType: post.videoType || undefined,
    publishDate: post.publishDate || new Date().toISOString().split('T')[0],
    views: typeof post.views === 'number' ? post.views : 0,
    source: post.source || 'user',
    status: post.status || 'published',
    scheduledAt: post.scheduledAt,
    createdAt: post.createdAt || Date.now(),
  }
}

function loadPosts(): IBlogPost[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        // 对每篇文章进行数据迁移，确保字段完整
        const migrated = parsed.map((p, i) => migratePost(p, i))
        // 保存迁移后的数据
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated))
        return migrated
      }
    }
  } catch {
    // 解析失败回退到 mock
  }
  // 首次：写入 mock 数据，默认全部published
  const withStatus = MOCK_BLOG_POSTS.map(p => ({ ...p, status: 'published' as const }))
  localStorage.setItem(STORAGE_KEY, JSON.stringify(withStatus))
  return withStatus
}

function savePosts(posts: IBlogPost[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts))
}

// 检查并发布到期的定时文章
function checkScheduledPosts(posts: IBlogPost[]): { posts: IBlogPost[]; published: number } {
  const now = Date.now()
  let publishedCount = 0
  const next = posts.map(p => {
    if (p.status === 'scheduled' && p.scheduledAt && p.scheduledAt <= now) {
      publishedCount++
      return { ...p, status: 'published' as const, publishDate: new Date(p.scheduledAt).toISOString().split('T')[0] }
    }
    return p
  })
  return { posts: next, published: publishedCount }
}

export function useBlogPosts() {
  const [posts, setPosts] = useState<IBlogPost[]>([])
  const [loaded, setLoaded] = useState(false)
  const checkRef = useRef<number | null>(null)

  const runScheduledCheck = useCallback(() => {
    setPosts(prev => {
      const { posts: next, published } = checkScheduledPosts(prev)
      if (published > 0) {
        savePosts(next)
      }
      return next
    })
  }, [])

  useEffect(() => {
    const initial = loadPosts()
    const { posts: checked } = checkScheduledPosts(initial)
    if (checked !== initial) savePosts(checked)
    setPosts(checked)
    setLoaded(true)

    // 每分钟检查一次定时发布
    checkRef.current = window.setInterval(runScheduledCheck, 60000)
    return () => {
      if (checkRef.current !== null) {
        clearInterval(checkRef.current)
        checkRef.current = null
      }
    }
  }, [runScheduledCheck])

  const addPost = useCallback((post: Omit<IBlogPost, 'id' | 'createdAt' | 'source' | 'views'> & { id?: string; status?: IBlogPost['status']; scheduledAt?: number }) => {
    setPosts(prev => {
      const newPost: IBlogPost = {
        ...post,
        id: post.id || `blog-${Date.now()}`,
        source: 'user',
        views: 0,
        status: post.status || 'published',
        scheduledAt: post.scheduledAt,
        createdAt: Date.now(),
      }
      const next = [newPost, ...prev]
      savePosts(next)
      return next
    })
  }, [])

  // 批量导入
  const bulkAddPosts = useCallback((postsData: Omit<IBlogPost, 'id' | 'createdAt' | 'source' | 'views'>[]) => {
    setPosts(prev => {
      const now = Date.now()
      const newPosts = postsData.map((p, i) => ({
        ...p,
        id: `blog-${now}-${i}`,
        source: 'user' as const,
        views: 0,
        status: p.status || 'published',
        scheduledAt: p.scheduledAt,
        createdAt: now + i,
      }))
      const next = [...newPosts, ...prev]
      savePosts(next)
      return next
    })
  }, [])

  const updatePost = useCallback((id: string, updates: Partial<IBlogPost>) => {
    setPosts(prev => {
      const next = prev.map(p => p.id === id ? { ...p, ...updates } : p)
      savePosts(next)
      return next
    })
  }, [])

  const deletePost = useCallback((id: string) => {
    setPosts(prev => {
      const next = prev.filter(p => p.id !== id)
      savePosts(next)
      return next
    })
  }, [])

  const resetPosts = useCallback(() => {
    const withStatus = MOCK_BLOG_POSTS.map(p => ({ ...p, status: 'published' as const }))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(withStatus))
    setPosts(withStatus)
  }, [])

  const incrementView = useCallback((id: string) => {
    setPosts(prev => {
      const next = prev.map(p => p.id === id ? { ...p, views: (p.views || 0) + 1 } : p)
      savePosts(next)
      return next
    })
  }, [])

  // 前台仅显示已发布的
  const publishedPosts = posts.filter(p => p.status === 'published' || !p.status)

  return {
    posts,
    publishedPosts,
    loaded,
    addPost,
    bulkAddPosts,
    updatePost,
    deletePost,
    resetPosts,
    incrementView,
    runScheduledCheck,
  }
}
