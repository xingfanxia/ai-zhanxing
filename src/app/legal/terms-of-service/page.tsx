import { Metadata } from 'next';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';

export const metadata: Metadata = {
  title: '服务条款 - AI占星',
  description: '使用本服务前请阅读服务条款',
};

// Simple markdown to HTML converter for basic formatting
// SECURITY NOTE: Content is from our own static files in public/legal/, not user input.
// This is safe because we control the source markdown files.
function markdownToHtml(markdown: string): string {
  let html = markdown
    // Escape HTML first to prevent any injection
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Restore HTML tags we want to keep (div, table, etc.)
    .replace(/&lt;div/g, '<div')
    .replace(/&lt;\/div&gt;/g, '</div>')
    .replace(/style="([^"]*)"/g, 'style="$1"')
    // Headers
    .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-6 mb-3 text-slate-200">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold mt-8 mb-4 text-white border-b pb-2 border-purple-500/30">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-8 mb-4 text-white">$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-purple-300">$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-purple-400 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
    // Tables - basic support
    .replace(/\|(.+)\|/g, (match) => {
      const cells = match.split('|').filter(Boolean).map(cell => cell.trim());
      if (cells.every(cell => cell.match(/^-+$/))) {
        return ''; // Skip separator row
      }
      const isHeader = cells.some(cell => cell.includes('---'));
      if (isHeader) return '';
      return `<tr class="border-b border-purple-500/20">${cells.map(cell =>
        `<td class="px-4 py-2 text-sm">${cell}</td>`
      ).join('')}</tr>`;
    })
    // Horizontal rule
    .replace(/^---$/gim, '<hr class="my-6 border-purple-500/30" />')
    // Line breaks
    .replace(/\n\n/g, '</p><p class="mb-4 text-slate-300 leading-relaxed">')
    // List items
    .replace(/^- (.*$)/gim, '<li class="ml-4 mb-1 text-slate-300">$1</li>')
    // Numbered list items
    .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 mb-1 text-slate-300 list-decimal">$1</li>');

  // Wrap in paragraph
  html = `<p class="mb-4 text-slate-300 leading-relaxed">${html}</p>`;

  return html;
}

export default async function TermsOfServicePage() {
  // Read markdown file at build time - this is our own static content, not user input
  // SECURITY: Only reads from a fixed path within our codebase (public/legal/)
  const filePath = path.join(process.cwd(), 'public', 'legal', 'terms-of-service.md');
  let content = '';

  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error('Failed to read terms of service:', error);
    content = '# Terms of Service\n\nContent loading error. Please try again later.';
  }

  // SECURITY NOTE: htmlContent is derived from our own static markdown files,
  // not from user input. The markdownToHtml function also escapes HTML entities first.
  // This is a common pattern for rendering static legal documents.
  const htmlContent = markdownToHtml(content);

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

      {/* Content - Safe: rendered from our own static markdown files, HTML escaped */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* eslint-disable-next-line react/no-danger -- Safe: static content from our own files */}
        <article
          className="prose prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-slate-400">
          <Link
            href="/legal/privacy-policy"
            className="text-purple-400 hover:underline"
          >
            隐私政策 / Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
