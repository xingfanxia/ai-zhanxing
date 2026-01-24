import { Metadata } from 'next';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

export const metadata: Metadata = {
  title: '隐私政策 - AI占星',
  description: '了解我们如何收集、使用和保护您的个人信息',
};

// Transform inline styles to Tailwind dark mode compatible classes
function transformCallouts(markdown: string): string {
  return markdown
    // Green callout boxes (security/positive info)
    .replace(
      /<div style="background: rgba\(76, 175, 80, 0\.15\); border: 2px solid rgba\(76, 175, 80, 0\.5\); padding: 20px; border-radius: 12px; margin: 20px 0;">/g,
      '<div class="bg-green-500/15 border-2 border-green-500/50 p-5 rounded-xl my-5">'
    )
    // Yellow/warning callout boxes
    .replace(
      /<div style="background: rgba\(255, 193, 7, 0\.15\); border: 2px solid rgba\(255, 193, 7, 0\.5\); padding: 20px; border-radius: 12px; margin: 20px 0;">/g,
      '<div class="bg-yellow-500/15 border-2 border-yellow-500/50 p-5 rounded-xl my-5">'
    )
    // Blue/info callout boxes
    .replace(
      /<div style="background: rgba\(33, 150, 243, 0\.15\); border: 2px solid rgba\(33, 150, 243, 0\.5\); padding: 20px; border-radius: 12px; margin: 20px 0;">/g,
      '<div class="bg-blue-500/15 border-2 border-blue-500/50 p-5 rounded-xl my-5">'
    )
    // Red/danger callout boxes
    .replace(
      /<div style="background: rgba\(244, 67, 54, 0\.15\); border: 2px solid rgba\(244, 67, 54, 0\.5\); padding: 20px; border-radius: 12px; margin: 20px 0;">/g,
      '<div class="bg-red-500/15 border-2 border-red-500/50 p-5 rounded-xl my-5">'
    );
}

export default async function PrivacyPolicyPage() {
  // Read markdown file at build time - this is our own static content, not user input
  // SECURITY: Only reads from a fixed path within our codebase (public/legal/)
  const filePath = path.join(process.cwd(), 'public', 'legal', 'privacy-policy.md');
  let content = '';

  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error('Failed to read privacy policy:', error);
    content = '# Privacy Policy\n\nContent loading error. Please try again later.';
  }

  // Transform inline styles to Tailwind classes for dark mode compatibility
  const transformedContent = transformCallouts(content);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
      {/* Header */}
      <header className="sticky top-0 bg-slate-950/80 backdrop-blur-sm border-b border-purple-500/20 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span>返回 / Back</span>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        <article className="prose prose-invert prose-purple max-w-none prose-headings:text-white prose-h1:text-2xl prose-h2:text-xl prose-h2:border-b prose-h2:border-purple-500/30 prose-h2:pb-2 prose-h3:text-lg prose-p:text-slate-300 prose-p:leading-relaxed prose-strong:text-purple-300 prose-a:text-purple-400 prose-li:text-slate-300 prose-table:border-collapse prose-th:border prose-th:border-purple-500/30 prose-th:bg-purple-500/10 prose-th:px-4 prose-th:py-2 prose-td:border prose-td:border-purple-500/20 prose-td:px-4 prose-td:py-2 prose-hr:border-purple-500/30">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {transformedContent}
          </ReactMarkdown>
        </article>
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-slate-400">
          <Link
            href="/legal/terms-of-service"
            className="text-purple-400 hover:underline"
          >
            服务条款 / Terms of Service
          </Link>
        </div>
      </footer>
    </div>
  );
}
